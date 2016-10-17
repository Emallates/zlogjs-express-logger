'use strict';
module.exports = local;

var onHeaders = require('on-headers')
  , onFinished = require('on-finished')
  , conf = require('../../.conf')
  , _ = require('../utils')
  , fs = require('fs')
  ;

function local(opts){ opts = opts || {}; 
  return function logger(req, res, next){
    let pre_write = res.write,
        pre_end = res.end;
    let data = [];
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
      res._startTime = undefined;
      let skip = (opts.configs.SKIP || false);
      let skipCode = (opts.configs.SKIP_CODE || false) ;
      recordStartTime.call(req)
        onFinished(res, logRequest);
        onHeaders(res, recordStartTime);
      function logRequest(){
        if(skipCode){
          if(_.compair(parseInt(res.statusCode), skipCode))
          return next();
        }
        if(skip){
          if(_.isFunction(skip) && skip(req, res)) return next();
          let path = (req.route) ? req.route.path : req.path;
          if(skip[path]){
            let sObj = skip[path];
            if(_.isBoolean(sObj) && sObj) return next();
            if(_.isObject(sObj)){
              let _rslt = [], opr = (sObj.OPR||'').toUpperCase() || 'OR'; 
              if( sObj.CODE ) _rslt.push( _.compair(parseInt(res.statusCode), sObj.CODE) );
              if( sObj.METHOD ){ _rslt.push( _.compair(req.method, sObj.METHOD) );}          
              if(opr == 'OR' && _.OR(_rslt, true)) return next();
              else if(_.AND(_rslt, false)) return next();
            }
            if(_.isInt(sObj)) { if(_.compair(parseInt(res.statusCode), sObj)) return next();  }          
          }
        }
        if(res.body != 404) _log(req, res);
      }
      };
      if(notSkip(req)) _log(req, res);
      next();
  }

}

function _log(req, res){
   let msg = _extract({req: req, res: res});
   let logStream = fs.createWriteStream('zlogjs.log', {'flags': 'a'});
   logStream.write(msg);
   logStream.end('.');
}

function _extract(obj){
   let strMsg = '\n';
   strMsg += xforwardip(obj.req);
   strMsg += '--'+'['+new Date().toISOString()+']--';
   strMsg += obj.req.method;
   strMsg += obj.req.originalUrl;
   strMsg += _.len(obj.req.query) > 0 ? '?' : '';
   for(let key in obj.req.query){
    strMsg += strMsg[strMsg.length -1] == '?' ? key+'='+obj.req.query[key] : '&'+key+'='+obj.req.query[key];
   }
   for(let key in obj.req.headers){ strMsg += ' - '+key.toUpperCase()+' - '+obj.req.headers[key];  } 
   if(_.len(obj.req.body) > 0) strMsg += ' -REQUEST_BODY- ';
   for(let key in obj.req.body) { strMsg += key+'='+obj.req.body[key]+','; }
   if(_.len(obj.res.body) > 0) strMsg += ' -RESPONSE_BODY- ';
   if(_.isObject(JSON.parse(obj.res.body)) || _.isArray(obj.res.body)){
     let data = JSON.parse(obj.res.body);
     for(let key in data){ strMsg += key+'='+data[key]+',';  }
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
    let ipAddress;
    let forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
      let forwardedIps = forwardedIpsStr.split(',');
      ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
      ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

function notSkip(req){
  return req.headers['x-man-zlogjs'];
}