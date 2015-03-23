Goal: a simple recipe manager.
Technologies: Node.js, Angular.js, MongoDB, Vagrant, Linux
Back end: node.js (with npm modules hapi and mongoose).  
Suggested test environment: use Vagrant to host Linux.  Install mongo and node on the VM.  It works fine to host on your local OS, but we usually try to have a separate environment that more closely matches our real production servers.
Suggest using github for version control.
Implement a basic web server using node.js that serves static pages using hapi.js
Add a small web service as follows
/api/recipe
uses a JSON data format, schema along the lines of
id: string (unique, returned after POST)
tags: array of strings
added: date string (timestamp recipe added)
title: string
ingredients: array of {qty: number, units: string, ingredient: string}
time: number (cooking time)
instructions: string
Methods:
POST /api/recipe - create a recipe
GET /api/recipe/{id} - retrieve a recipe by id
PUT /api/recipe/{id} - update a recipe; can't change id.
DELETE /api/recipe/{id} - delete a recipe
GET /api/recipe?key=val&key=val[...] - search for recipes
example: /api/recipe?tag=vegan
example: /api/recipe?ingredient=chicken
idea: text index for freetext search?
idea: come up with a way to find recipes with a 1 hour or less time?
Your web service should persist recipes to MongoDB.  
Consider writing some simple unit tests for making sure the API does the right thing.
We use gulp as a build system. This might be useful for you as well.
Consider writing a batch importer tool to grab a bunch of recipes from some public site to have some real data quickly.
Use AngularJS to build a single-page web application to explore your recipe database.
Page defaults to showing all recipes titles and dates (paged?)
App hosted at http://yourserver/recipes
Update url to http://yourserver/recipes/recipename as you navigate around.
Support bookmarked urls going straight to a recipe via recipename as above
Allow sorting by various criteria
Provide a search field
Clicking on a recipe title takes you to the detail for the recipe (client side route)
You'll want to build out several directives:
recipe renderer
recipe editor (or maybe that's a mode of the renderer?  up to you.)
recipe list renderer
search tool 
Suggest you use LESS (and possibly Bootstrap) for styles
When you render a tag in a recipe, it should be clickable to trigger a search for other recipes with that tag.  Consider other ways to crosslink content.
If you implement time search, perhaps have a "max time" filter control?

