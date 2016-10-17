var MODEL = {};
MODEL.client = require('enoa-client')({
       appId:'app_id', apiKey:'apiKey'	
	   , collections:{  	
		   zlog:{
			   appId:'5jRp0oA',
			   apiKey:'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IiMxNDowIiwidHlwZSI6InRlc3QiLCJuYW1lIjoidGVzdC16bG9nanMifQ.58J3A2EE9NDjOkbtUeKRXYytTfXbhEgOA0GjKYtgjSs',
			   adapter:require('zlogjs-adapter'),
			   plugin: 'zlogjs-express-logger', 
			   host:'192.168.0.5', port:'4000' ,
			   mode:"local",	
			   // mode:"remote",
		   }
	   }
});

//MORE CASES WILL BE ADDED HERE WHEN SERVICE WILL BE ONLINE
MODEL.CASES = {
	"zlogjs-express-logger tests":{
		"Initialization Test":{
			TITLE:"should be a function",
			EQUALS:"function",
			EXECUTER:typeof MODEL.client.zlog.logger
		}
	}
};

// MODEL.REQ = {
// 	GET:{
// 		header:function(key){ return MODEL.REQ.headers[key]; },
// 		headers:{
// 			'x-forwarded-for':'192.168.0.5,ip1,ip2'
// 		},
// 		connection:{
// 			remoteAddress:'192.168.0.5'
// 		},
// 		originalUrl:'/test',
// 		query:{q1:1,q2:2},
// 		params:{p1:1,p2:2}
// 	}, 
// 	POST:{
// 		header:function(key){ return MODEL.REQ.headers[key]; },
// 		headers:{
// 			'x-forwarded-for':'192.168.0.5,ip1,ip2'
// 		},
// 		connection:{
// 			remoteAddress:'192.168.0.5'
// 		},
// 		originalUrl:'/test',
// 		query:{q1:1,q2:2},
// 		params:{p1:1,p2:2},
// 		body:{v1:1,v2:2,v3:3}
// 	}
// };

// MODEL.RES = {
// 	body:{v1:1,v2:2,v3:3},
// 	statusCode:200
// };

module.exports = MODEL;