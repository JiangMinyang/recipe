var hapi = require('hapi');
var qstring = require('querystring');
var mongoose = require('mongoose');
var server = new hapi.Server();

var db = mongoose.connect('mongodb://localhost/test');
var recipeSchema = require('./scripts/recipe_schema.js').recipeSchema;
var Recipe = mongoose.model('Recipe', recipeSchema, 'recipe');

server.connection({port : 8080});

server.route({
	method	: "GET",
	path	: "/",
	handler : function(request, response) {
		response.file('index.html');
	}
});

server.route({
	method	: "GET",
	path	: "/scripts/{name}",
	handler : function(request, response) {
		response.file('./scripts/' + request.params.name);
	}
});


server.route({
	method	: "GET",
	path	: "/partials/{name}",
	handler : function(request, response) {
		response.file('./partials/' + request.params.name);
	}
});

server.route({
	method	: "GET",
	path	: "/stylesheet/{name}",
	handler : function(request, response) {
		response.file('./stylesheet/' + request.params.name);
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
				response("Can't find the recipe", 404);
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
		var query = request.query;
		var Docs = Recipe.find();
		var amount = 0;
	//	console.log(query);
		if ('amount' in query) {
			amount = query.amount;
		}
		else amount = 10;
		var page = 1;
		if ('page' in query) page = query.page;
		Docs.skip(amount * (page - 1));
		Docs.limit(amount);
		if ('title' in query) {
			Docs.where('title').regex(new RegExp(query.title, 'i'));
		}	
		if ('tag' in query) {
			Docs.all('tags', query.tag);
		}
		if ('sort' in query) {
			Docs.sort(query.sort);
		}
		if ('maxtime' in query) {
			Docs.where({'time' : {$lt: query.maxtime}});
		}
		Docs.exec(function(err, docs) {
			if (err) {
				response("", 400);
				return console.log(err);
			}
			response(docs);
		});
	}
});
server.route({
 	method	:	"POST",
	path	:	"/api/recipe",
	handler	:	function(request, response) {
		var query = request.query;
		console.log(query);
		if (!('title' in query)) {
			response("", 400);
			return console.log("Nothing Added");
		}
		query.added = new Date().toString();
		if (query.time == 'undefined') query.time = '';
		if (query.instruction == 'undefined') query.instruction = '';
		query.ingredients = [];
		if ('qty' in query) {
			for(var i = 0; i < query.qty.length; i++)
				query.ingredients.push({qty : query.qty[i], units : query.unit[i], ingredient : query.ingredient[i] } );
		}
		
		query.tags = [];
		if ('tag' in query) {
			if (typeof(query.tag) == 'string') query.tags[0] = query.tag;
			else {
			for(var i = 0; i < query.tag.length; i++)
				query.tags[i] = query.tag[i];
			}
		}
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
		var ID = request.params.id;
		var query = request.query;
		var updateDoc = Recipe.find().where('_id', ID);
		query.ingredients = [];
		if ('qty' in query) {
			for(var i = 0; i < query.qty.length; i++)
				query.ingredients.push({qty : query.qty[i], units : query.unit[i], ingredient : query.ingredient[i] } );
		}
		
		query.tags = [];
		if ('tag' in query) {
			for(var i = 0; i < query.tag.length; i++)
				query.tags[i] = query.tag[i];
		}

		updateDoc.exec(function(err, result) {
			if (err) {
				response("Can't update this doc");
				return console.log(err);
			}
			result[0].update(query, {w : 1}, function(err, result) {
				if (err) {
					response("Can't update this doc");
					return console.log(err);
				}	
				console.log(result);
				response("Update succeed");
			});
		});
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
