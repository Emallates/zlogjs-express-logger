'use strict';
let _ = require('./utils');
module.exports = function(options){	
  let ext = {};
  ext.logger = function logger(){
  	return (_.isEmpty(options.configs.appId) || _.isEmpty(options.configs.apiKey) || options.configs.mode == 'local' || options.configs.mode == undefined) ? require('./loggers/local')(options) : require('./loggers/remote.js')(options, {}); 
  };
  return ext;
};