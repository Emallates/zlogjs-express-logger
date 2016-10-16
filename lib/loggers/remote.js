'use strict';
module.exports = remote;

var debug = require('debug')
  , onHeaders = require('on-headers')
  , http = require('http')
  , url = require('url')
  , onFinished = require('on-finished')
  , conf = require('../../.conf')
  , _ = require('../utils')
  ;

function remote(creds, options/*, request*/){
  var base = {input:creds.ibase};
  var opts = options || {};
  var immediate = opts.immediate;
  var sURL = creds.host || creds.configs.host;
  if(!sURL) throw new Error('Define server url first');
  var skip = opts.SKIP || creds.configs.SKIP || false;
  var skipCode = opts.SKIP_CODE || creds.configs.SKIP_CODE || false;
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
      // req._tags = getTags(req, options.TAGS)
      // response data
      res._startAt = undefined
      res._startTime = undefined
      // record request start
      var start = new Date;
      res._responseTime = true;
      recordStartTime.call(req)
      if(immediate) { logRequest(); }
      else {
        onFinished(res, logRequest);
        onHeaders(res, recordStartTime);
      }
      function logRequest(){
        req.headers['X-Response-Time'] = new Date - start;
        if(skipCode){
          if(_.compair(parseInt(res.statusCode), skipCode))
          return next();
        }
        if(skip){
          if(_.isFunction(skip) && skip(req, res)) return next();
          var path = (req.route) ? req.route.path : req.path;
          if(skip[path]){
            var sObj = skip[path];
            if(_.isBoolean(sObj) && sObj) return next();
            if(_.isObject(sObj)){
              var _rslt = [], opr = (sObj.OPR||'').toUpperCase() || 'OR'; 
              if( sObj.CODE ) _rslt.push( _.compair(parseInt(res.statusCode), sObj.CODE) );
              if( sObj.METHOD ){ _rslt.push( _.compair(req.method, sObj.METHOD) );}          
              if(opr == 'OR' && _.OR(_rslt, true)) return next();
              else if(_.AND(_rslt, false)) return next();
            }
            if(_.isInt(sObj)) { if(_.compair(parseInt(res.statusCode), sObj)) return next();  }          
          }
        }
        if(opts.debug){
          console.log('log: ', path, res.statusCode, req.params, req.query);
          return;
        }
        if(res.body != 404) _process({req:req, res:res, base: base}, creds, opts);
      }
      };

      next();
  }

}

function _process(obj, creds, options){
  var base = obj.base;
   var mbody = {};
   mbody.msg = {
     response:obj.res.statusCode == 304 ? undefined : _.isObject(obj.res.body) ? obj.res.body : _.isString(obj.res.body) ? obj.res.body : undefined,
     request:{
       body:{
         body:obj.req.body, 
         query:obj.req.query,
         params:obj.req.params
       }
       , ipxf:xforwardip(obj.req)
       , headers: obj.req.headers
       , ip:obj.req._remoteAddress
       , timestamp:new Date().toISOString()
       , tags:getTags(obj.req, options.TAGS || creds.configs.TAGS) 
       , route:(obj.req.route) ? {path:obj.req.route.path, method:obj.req.route.stack[0].method, methods:obj.req.route.methods} : {path:obj.req.path}
       , originalUrl : obj.req.originalUrl
       , method: obj.req.method
     }
   };
   mbody.token = creds.configs.apiKey;
   mbody.app_id = creds.configs.appId;
   mbody.code = mbody.msg.mcode = parseInt(obj.res.statusCode);
   // mbody = ext(obj, mbody);
   mbody.l = true;
   if(creds.configs.debug) console.log(mbody.msg);
   creds._request({body:mbody, url:creds.host || creds.configs.host+base.input, timeout:creds.configs.timeout, method:"POST"}, function(err,res, data){  
        if(err) console.log('[LOG MESSAGE TO REMOTE FAILED] - '+err+' OR '+'SERVICE UNAVALIBLE');
        else console.log('LOGGED MESSAGE TO REMOTE');
   });
}

function ext(obj, mObj){
   for(var v in obj){ if(conf.CB_CRITERIA[v] === obj[v]) mObj[v] = conf.CB_CRITERIA[v].valid(obj[v]);   }
   for(var index in conf.EXEC_CRITERIA.CONFIGURED){  mObj[conf.EXEC_CRITERIA.CONFIGURED[index]] = true; }
   return mObj;
};

/**
 * Record the start time.
 * @private
 */

function recordStartTime() {
  this._startAt = process.hrtime()
  this._startTime = new Date()
}

/**
 * Get request IP address.
 *
 * @private
 * @param {IncomingMessage} req
 * @return {string}
 */

function getip(req) {
  return req.ip
    || req._remoteAddress
    || (req.connection && req.connection.remoteAddress)
    || undefined;
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

function getTags(req, tags){
  tags = tags || {};
  return { splitter : tags.splitter || '>',tags: tags[req.route.path || req.path] } || {};
}

function getBody(res, data){
  if(typeof data[0] == 'string') return data[0].split(' ')[0] != 'Cannot' ? Buffer.concat(data).toString('utf8') : 404;
  if(typeof data[0] != 'string') return Buffer.concat(data).toString('utf8');
}