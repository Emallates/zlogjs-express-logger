'use strict';
let _ = require('./utils');
module.exports = function(options){	
  let ext = {configs : options};
  ext.logger = function logger(){
  	return (_.isEmpty(options.configs.appId) || _.isEmpty(options.configs.apiKey) || options.configs.mode == 'local' || options.configs.mode == undefined) ? require('./loggers/local')(ext.configs) : require('./loggers/remote.js')(ext.configs, {}); 
  };
  ext.log = function log(){};
  return ext;
};