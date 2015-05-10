var fs = require('fs');
var http = require('http');
var qstring = require('querystring');
fs.readFile('a.txt', function(err, data) {
	if (err) return console.log(err);
	var Recipe = data.toString();
	var Recipes = JSON.parse(Recipe).matches;
	for(var i in Recipes) {
	var queryObj = {};
	queryObj.title = Recipes[i].recipeName;
	queryObj.time = Recipes[i].totalTimeInSeconds / 60;
	queryObj.tag = [];
	if ('course' in Recipes[i].attributes)
	for(var j = 0; j < Recipes[i].attributes.course.length; j++) queryObj.tag.push(Recipes[i].attributes.course[j]);
	if ('cuisine' in Recipes[i].attributes)
	for(var j = 0; j < Recipes[i].attributes.cuisine.length; j++) queryObj.tag.push(Recipes[i].attributes.cuisine[j]);
	queryObj.qty = [];
	queryObj.unit = [];
	queryObj.ingredient = [];
	for(var j = 0; j < Recipes[i].ingredients.length; j++) {
		queryObj.qty.push('1');
		queryObj.unit.push('unit');
		queryObj.ingredient.push(Recipes[i].ingredients[j]);
	}
	console.log('curl --request POST http://192.168.33.10:8080/api/recipe?' + qstring.stringify(queryObj));
	/*
	var options = {
		method : 'POST',
		url  : 'http://192.168.33.10:8080/api/recipe?' + qstring.stringify(queryObj),
	}
	http.request(options, function(err) {
		console.log('hello');
		if (err) return console.log(err);
	}).end();
		*/
	};
});
