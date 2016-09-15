var ZLOG = {  
    configs:{	
		   appId:'5jRp0oA',
		   apiKey:'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IiMxNDowIiwidHlwZSI6InRlc3QiLCJuYW1lIjoidGVzdC16bG9nanMifQ.58J3A2EE9NDjOkbtUeKRXYytTfXbhEgOA0GjKYtgjSs',
		   host:'192.168.0.5', port:'4000' ,
		   mode:"local"
	}	   
};
var logger = require('./lib/logger')(ZLOG);

console.log(logger);
