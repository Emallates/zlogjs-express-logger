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
	},
	MSG_STATUS:{EXC:{LABEL:"Exceptions",COLOR:"#ff0000", RANGE:{'code':{'>=':[500]}}}, SUC:{LABEL:"Successes", COLOR:"#57AE57", RANGE:{'code':{from:200, to:399}}},ERR:{LABEL:"Errors",COLOR:"#FFFF00", RANGE:{'code':{from:400, to:499}}}},
	OPERATION_CNT : {"Create":0, "Read":0, "Update":0, Delete:0},
	OPERATION_MAP :{ "CREATE":"POST", "READ":"GET", "UPDATE":"PUT", DELETE:"DELETE"  },
	METHOD_MAP :{ "POST":"CREATE", "GET":"READ", "PUT":"UPDATE", DELETE:"DELETE"  },
	OPERATIONS : {READ:{q:{method:"GET"}, LABEL:"Read"}, CREATE:{q:{method:"POST"}, LABEL:"Create"}, UPDATE:{q:{method:"PUT"}, LABEL:"Update"}, DELETE:{q:{method:"DELETE"}, LABEL:"Delete"}},
	CODES_MAP :{
		"200": "OK","201": "Created","202": "Accepted","203": "Non-Authoritative Information","204": "No Content","205": "Reset Content","206": "Partial Content","300": "Multiple Choices","301": "Moved Permanently","302": "Found","303": "See Other","304": "Not Modified","305": "Use Proxy","306": "Unused","307": "Temporary Redirect","400": "Bad Request","401": "Unauthorized","402": "Payment Required","403": "Forbidden","404": "Not Found","405": "Method Not Allowed","406": "Not Acceptable","407": "Proxy Authentication Required","408": "Request Timeout","409": "Conflict","410": "Gone","411": "Length Required","412": "Precondition Failed","413": "Request Entity Too Large","414": "Request-URI Too Long","415": "Unsupported Media Type","416": "Requested Range Not Satisfiable","417": "Expectation Failed","500": "Internal Server Error","501": "Not Implemented","502": "Bad Gateway","503": "Service Unavailable","504": "Gateway Timeout"
	}
}