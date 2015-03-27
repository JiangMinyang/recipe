var hapi = require('hapi');

var server = new hapi.Server();
server.connection({port : 3000});

server.route({
	method	:	"GET",
	path	:	"/",
	handler	:	function(request, response) {
		console.log(request.params);
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
