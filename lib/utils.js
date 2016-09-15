var _u = {};

/**
 * Get server URL .
 *
 * @private
 * @param {server url config object} obj
 * @return {string}
 */

_u.isEmpty = function(data){ return _u.len(data) < 1; };

_u.len = function(data){ return _u.isObject(data) ? Object.keys(data).length : _u.isString(data) || _u.isArray(data) ? data.length : null; };

_u.isObject = function(data){ return _u.type(data) == '[object Object]'; };

_u.isArray = function(data){ return _u.type(data) == '[object Array]'; };

_u.isString = function(data){ return _u.type(data) == '[object String]'; };

_u.isFunction = function(data){ return this.type(data) == '[object Function]';  };

_u.isBoolean = function(data){  return this.type(data) ==  '[object Boolean]';  }

_u.getserverUrl = function getserverUrl(obj) {
  switch(_u.typeof(obj)){
  	case 'string': return obj;
  	case 'object': return (obj.url) ? obj.url+( (obj.port)?(':'+obj.port):'' ) : undefined;
  }
}




_u.clone = function (obj, deep) {
	if(!deep) return JSON.parse(JSON.stringify(obj));	
	var target = {};
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			target[i] = obj[i];
		}
	}
	return target;
}

_u.typeof = function (val) {
 switch(Object.prototype.toString.call(val)){
  case '[object Object]': return 'object'; break;
  case '[object Array]': return 'array'; break;
  case '[object String]': return 'string'; break;
  case '[object Number]': return 'number' ; break;
  case '[object Boolean]': return 'bool' ; break;
  case '[object Function]': return 'function' ; break;
  // case '[object Undefined]': return 'undefined';
  default: return 'undefined';
 }
}

_u.isArray = function (obj){ return (_u.typeof(obj) === 'array') };
_u.isObject = function (obj){ return (_u.typeof(obj) === 'object') };
_u.isString = function (str){ return ( _u.typeof(str) === 'string' ); }

_u.deepClone = function(obj){ return _u.clone(obj, true); }
_u.arrToObj = function(arr, defVal){
  if(Array.isArray(arr)){
      var obj = {};
      for(var i in arr){
        if(typeof arr[i] === 'string') obj[ arr[i] ] = defVal || true;
        else obj[ arr[i].name ] = arr[i].values || defVal || true;
      }
      return obj;
    }
    if(typeof arr === 'object' && arr != null) return arr;
    return {};

}

_u.OR = function (arr, val){ return arr.indexOf(val) != -1; }
_u.AND = function (arr, val){ return arr.indexOf(val) == -1; }

_u.compair = function (status, sObj, opr){
	var result = []; opr = opr || 'OR';

	switch(_u.typeof(sObj)){
		case 'number': case 'string': result.push(sObj === status); break;
		case 'object':
			result.push(_u.compairObject(status, sObj));
			break;
		case 'array': for(var i in sObj) result.push(_u.compairObject(status, sObj[i]));  break;
	}
	return (opr == 'OR') ? _u.OR(result, true) : _u.AND(result, false);
}
_u.compairObject = function (status, sObj){
	
	if(_u.typeof(sObj) == 'number' || _u.typeof(sObj) == 'string' ) return (status == sObj);
	
	var resArr = [];
	var opr = (sObj.or || sObj.OR || (sObj.opr||'').toUpperCase() == 'OR') ? 'OR' : 'AND';
	for(var i in sObj){
		switch(i){
			case '>':             resArr.push(status > sObj[i] ); break;
			case '=>':case '>=':  resArr.push(status >= sObj[i] ); break;
			case '=': case '==':  resArr.push(status == sObj[i] ); break;
			case '!=':case '!==': resArr.push(status != sObj[i] ); break;
			case '<':             resArr.push(status < sObj[i] ); break;
			case '=<':case '<=':  resArr.push(status <= sObj[i] ); break;
		}
	}
	return (opr == 'OR') ? _u.OR(resArr, true) : _u.AND(resArr, false);
}

// console.log(_u.compair(500, [200, 300, 500]))


module.exports = _u;