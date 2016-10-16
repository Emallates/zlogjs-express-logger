'use strict';
module.exports = local;

var onHeaders = require('on-headers')
  , onFinished = require('on-finished')
  , conf = require('../../.conf')
  , _ = require('../utils')
  , fs = require('fs')
  ;

function local(){
  return function logger(req, res, next){
    var pre_write = res.write,
        pre_end = res.end;
    var data = [];
    res.write = function (chunk) {
      data.push(chunk);
      pre_write.apply(res, arguments);
    };
   res.end = function (chunk) {
      if (chunk) data.push(chunk);
      res.body = getBody(res, data);
      pre_end.apply(res, arguments);
      req._startAt = undefined
      req._startTime = undefined
      req._remoteAddress = getip(req)
      res._startAt = undefined
      res._startTime = undefined
      recordStartTime.call(req)
        onFinished(res, logRequest);
        onHeaders(res, recordStartTime);
      function logRequest(){
        if(res.body != 404) _log(req, res);
      }
      };

      next();
  }

}

function _log(req, res){
   var msg = _extract({req: req, res: res});
   var logStream = fs.createWriteStream('zlogjs.log', {'flags': 'a'});
   logStream.write(msg);
   logStream.end('.');
}

function _extract(obj){
   var strMsg = '\n';
   strMsg += xforwardip(obj.req);
   strMsg += '--'+'['+new Date().toISOString()+']--';
   strMsg += obj.req.method;
   strMsg += obj.req.originalUrl;
   // strMsg += _.len(obj.req.params) > 0 ? '/' : '';
   // for(key in obj.req.params) {  strMsg += obj.req.params[key]; break; } 
   strMsg += _.len(obj.req.query) > 0 ? '?' : '';
   for(var key in obj.req.query){
    strMsg += strMsg[strMsg.length -1] == '?' ? key+'='+obj.req.query[key] : '&'+key+'='+obj.req.query[key];
   }
   for(var key in obj.req.headers){ strMsg += ' - '+key.toUpperCase()+' - '+obj.req.headers[key];  } 
   if(_.len(obj.req.body) > 0) strMsg += ' -REQUEST_BODY- ';
   for(var key in obj.req.body) { strMsg += key+'='+obj.req.body[key]+','; }
   if(_.len(obj.res.body) > 0) strMsg += ' -RESPONSE_BODY- ';
   if(_.isObject(JSON.parse(obj.res.body)) || _.isArray(obj.res.body)){
     var data = JSON.parse(obj.res.body);
     for(var key in data){ strMsg += key+'='+data[key]+',';  }
   } 
   if(_.isString(JSON.parse(obj.res.body))) strMsg +=obj.res.body; 
   strMsg += ' -CODE- '+obj.res.statusCode;
   console.log('[LOG][STR] '+strMsg,'\n');
   return strMsg;
}

function getBody(res, data){
  if(typeof data[0] == 'string') return data[0].split(' ')[0] != 'Cannot' ? Buffer.concat(data).toString('utf8') : 404;
  if(typeof data[0] != 'string') return Buffer.concat(data).toString('utf8');
}

function getip(req) {
  return req.ip
    || req._remoteAddress
    || (req.connection && req.connection.remoteAddress)
    || undefined;
}

function recordStartTime() {
  this._startAt = process.hrtime()
  this._startTime = new Date()
}

function xforwardip(req){
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
      var forwardedIps = forwardedIpsStr.split(',');
      ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
      ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}
