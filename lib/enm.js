//[err][relation][subject][object type][this]
module.exports = {
	ERRORS : {"CON":"[ECON_CONNECTION_REFUSED][FOR][REQUEST][QUERY]"},
	CB_CRITERIA  :{
		l : {type:'boolean', valid: function(v){ return v === true || v === false ? v : true; }},
		f : {url:''},
		sms:{number: '', rule:''},
        email:{email:'',rule:''},
	},
	EXEC_CRITERIA :{
		CONFIGURED: ['def','d','m'],
	    ALLOWED_CRIT : ['def','d','m','c','e','loc','save']
	}
}