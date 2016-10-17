var model = require('./cases');
var assert = require('assert');
for(var key in model.CASES)
describe(key, function(){
    for(var kik in model.CASES[key])
	describe(kik, function(){
	   it(model.CASES[key][kik].TITLE, function(){
          assert.equal(model.CASES[key][kik].EQUALS, model.CASES[key][kik].EXECUTER); 
	   });
	});	
});