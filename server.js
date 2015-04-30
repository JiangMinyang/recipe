var hapi = require('hapi');
var qstring = require('querystring');
var mongoose = require('mongoose');
var server = new hapi.Server();

var db = mongoose.connect('mongodb://localhost/test');
var recipeSchema = require('./recipe_schema.js').recipeSchema;
var Recipe = mongoose.model('Recipe', recipeSchema, 'recipe');

server.connection({port : 8080});

server.route({
	method	: "GET",
	path	: "/",
	handler : function(request, response) {
		response.file(index.html);
	}
});

server.route({
	method	:	"GET",
	path	:	"/api/recipe/{id}",
	handler	:	function(request, response) {
		var ID = request.params.id;
		console.log(ID);
		var query = Recipe.find().where('_id', ID);
		query.exec(function(err, doc) {
			if (err) {
				response("Can't find the recipe");
				return console.log("Get recipe Failed");
			}
			response(doc, 200);
		});
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
		query.added = new Date().toString();
		query.ingredients = [];
		for(var i = 0; i < query.qty.length; i++)
		query.ingredients.push({qty : query.qty[i], units : query.unit[i], ingredient : query.ingredient[i] } );
		console.log(query);
		var recipe = new Recipe(query);
		recipe.save(function(err, doc) {
			console.log("Recipe Added");
			response(doc._id);
		});
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
		var ID = request.params.id;
		var query = Recipe.remove().where('_id', ID);
		query.exec(function(err, results) {
			if (err) {
				response("Can't delete recipe", 400);
				return console.log('delete failed');
			}
			response("Delete Succeed", 200);
		});
	}
});


server.start(function() {
	console.log("Server running at: ", server.info.uri);
});
