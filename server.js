var hapi = require('hapi');
var qstring = require('querystring');
var mongoose = require('mongoose');
var server = new hapi.Server();

var db = mongoose.connect('mongodb://localhost/test');
var recipeSchema = require('./recipe_schema.js').recipeSchema;
var Recipe = mongoose.model('Recipe', recipeSchema, 'recipe');

server.connection({port : 8080});


server.route({
	method	:	"GET",
	path	:	"/api/recipe/{id}",
	handler	:	function(request, response) {
		/*
		var ID = request.params.id;
		console.log(ID);
		var query = Recipe.find().where('_id', ID);
		query.exec(function(err, doc) {
			if (err) return console.log(err);
			response(doc, 200);
		});
		*/
	}
});
server.route({
	method	:	"GET",
	path	:	"/api/recipe",
	handler	:	function(request, response) {
		//console.log(request.query);
		response("hello");
	}
});

server.route({
	method	:	"POST",
	path	:	"/api/recipe",
	handler	:	function(request, response) {
		var query = request.query;
		console.log(query);
		response('!!!');
	}

});

server.route({
	method	:	"PUT",
	path	:	"/api/recipe/{id}",
	handler	:	function(request, response) {

	}

});
server.route({
	method	:	"DELETE",
	path	:	"/api/recipe/{id}",
	handler	:	function(request, response) {

	}
});


server.start(function() {
	console.log("Server running at: ", server.info.uri);
});
