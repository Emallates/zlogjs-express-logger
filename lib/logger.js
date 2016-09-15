module.exports = function(opts){ 
	return opts.request != undefined && opts.response != undefined /*&& opts.tpr != undefined*/ ? require('./ext')(opts).log() : require('./ext')(opts).logger(); 
};