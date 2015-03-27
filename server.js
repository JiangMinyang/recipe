var hapi = require('hapi');
var qstring = require('querystring');
var server = new hapi.Server();
server.connection({port : 3000});

server.route({
	method	:	"GET",
	path	:	"/api/recipe/{id}",
	handler	:	function(request, response) {
		response("hello");
	}
});
server.route({
	method	:	"GET",
	path	:	"/api/recipe",
	handler	:	function(request, response) {
		console.log(request.query);
		response("hello");
	}
});
/*
server.route({
	method	:	"GET",
	path	:	"/",
	handler	:	function(request, response) {

	}

});
server.route({
	method	:	"GET",
	path	:	"/",
	handler	:	function(request, response) {

	}

});
server.route({
	method	:	"GET",
	path	:	"/",
	handler	:	function(request, response) {

	}
});
*/
server.start(function() {
	console.log("Server running at: ", server.info.uri);
});
