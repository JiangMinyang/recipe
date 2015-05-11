var app = angular.module('recipeManager', ['ngRoute']).
	config(function($routeProvider) {
		$routeProvider.
			when('/recipes', { templateUrl: './partials/Mainrecipe.html', controller : 'recipeCtrl'}).
			when('/recipes/recipename/:id', {templateUrl : './partials/recipe.html', controller : 'recipeCtrl2'}).
			//when('/recipes/test', {templateUrl : './partials/test.html', controller : 'recipeCtrl'}).
			otherwise({ redirectTo : '/recipes'} );
	});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.controller('recipeCtrl', function($scope, $http){
	$scope.addedTags = [];
	$scope.tagg = '';
	$scope.qty = '';
	$scope.unit = '';
	$scope.ingre = '';
	$scope.addingIngredient = {};
	$scope.addingIngredient.qty = [];
	$scope.addingIngredient.unit = [];
	$scope.addingIngredient.ingre = [];
	$scope.recipedetail = [];
	$scope.maxTime = '';
	$scope.page = 1;
	$scope.pages = [];
	$scope.currentpage = 1;
	//console.log(typeof($scope.addingIngredient) + "11111");
	$scope.Reset = function() {
		$scope.title = $scope.tags = $scope.maxTime = '';
		$http.get("http://192.168.33.10:8080/api/recipe?").success(function(response, status) {
		//console.log(response);
		$scope.currentPage = 1;
		$scope.searchResults = response;
		$scope.pages = [];
		for(var i = 0; i < Math.floor(($scope.searchResults.length - 1) / 12) + 1; i++) {
			$scope.pages[i] = i + 1;
		}
	});
	}
	
	$scope.Reset();
	$scope.checkAct = function(i) {
		console.log(i);
		return 'active';
	}
	
	var doGetRequest = function(urlStr) {
		if (typeof($scope.title) != 'undefined' && $scope.title != '') urlStr = urlStr + 'title=' + $scope.title;
		if (typeof($scope.tags) != 'undefined' && $scope.tags != '') {
			var tag = $scope.tags.split(',');
			if (tag != '') {
				for(var i = 0; i < tag.length; i++)
					urlStr = urlStr + '&tag=' + tag[i];
			}
		}
		//console.log(urlStr);
		if ($scope.maxTime != '') urlStr += "&maxtime=" + $scope.maxTime;
		var temp = $http.get(urlStr);
		temp.success(function(response, status) {
			console.log(response);
			$scope.searchResults = response;
			$scope.pages = [];
			for(var i = 0; i < Math.floor(($scope.searchResults.length - 1) / 12) + 1; i++)
			$scope.pages[i] = i + 1;
			//		console.log($scope.searchResults);
		});

	}
	
	$scope.searchByTag = function(tag) {
		var urlStr = "http://192.168.33.10:8080/api/recipe?tag=" + tag;
		$scope.title = '';
		$scope.maxTime = '';
		$scope.changeTo(1);
		$scope.tags = tag;
		doGetRequest(urlStr);
	}
	
	$scope.Search = function() {
		var urlStr = "http://192.168.33.10:8080/api/recipe?";
		$scope.currentPage = 1;
		doGetRequest(urlStr);
	}

	$scope.changeTo = function(page) {
		$scope.currentpage = page;
		$scope.page = page;
	}
	
	$scope.changeToPrev = function() {
		if ($scope.currentpage != 1) {
			$scope.currentpage = $scope.currentpage - 1;
			$scope.page = $scope.currentpage;
		}
	}
	
	$scope.changeToNext = function() {
		if ($scope.currentpage != Math.floor(($scope.searchResults.length - 1) / 12) + 1) {
			$scope.currentpage += 1;
			$scope.page = $scope.currentpage;
		}
	}
	
	/*
	$scope.sortByKey = function(key) {
		var urlStr = "http://192.168.33.10:8080/api/recipe?";
		urlStr = urlStr + "&sort=" + key;
		$scope.currentPage = 1;
		doGetRequest(urlStr);
	}
	*/
	
	$scope.sortByKey = function(key) {
		$scope.Key = key;
	}
	
	$scope.addTag = function() {
		$scope.addedTags.push($scope.tagg);
		$scope.tagg = '';
		console.log($scope.addedTags);
	}
	
	$scope.addIngredient = function () {
		$scope.addingIngredient.qty.push($scope.qty);
		$scope.addingIngredient.unit.push($scope.unit);
		$scope.addingIngredient.ingre.push($scope.ingre);
		$scope.qty = $scope.unit = $scope.ingre = '';
	}
	
	$scope.checkNumber = function() {
		return !(!$scope.addTime || !isNaN($scope.addTime))
	}
	
	$scope.checkRecipeValid = function() {
		var flag = true;
		if (!$scope.addTitle) flag = false;
		if ($scope.checkNumber()) flag = false;
		return !flag;
	}
	
	var serialize = function(obj, prefix) {
	  	var str = [];
	  	for(var p in obj) {
	   	 	if (obj.hasOwnProperty(p)) {
	      		var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
	      		str.push(typeof v == "object" ?
	        	serialize(v, k) :
	        	encodeURIComponent(k) + "=" + encodeURIComponent(v));
	   		 }
	  	}
	  return str.join("&");
	}
	
	$scope.addRecipe = function() {
		var queryObj = {};
		queryObj.title = $scope.addTitle;
		queryObj.tag = $scope.addedTags;
		queryObj.qty = $scope.addingIngredient.qty;
		queryObj.unit = $scope.addingIngredient.unit;
		queryObj.ingredient = $scope.addingIngredient.ingre;
		queryObj.time = $scope.addTime;
		queryObj.instructions = $scope.addInstruction;
		$scope.addTitle = $scope.addTime = $scope.addInstruction = '';
		$scope.addingIngredient.qty = [];
		$scope.addingIngredient.unit = [];
		$scope.addingIngredient.ingre = [];
		var queryStr = serialize(queryObj);
		var urlStr = "http://192.168.33.10:8080/api/recipe?" + queryStr;
		//var temp = $http.post(urlStr, queryStr);
		var temp = $http({
			method : 'post',
			url : urlStr
		});
		temp.success(function(response, status) {
			$http.get("http://192.168.33.10:8080/api/recipe/" + response).success(function(response, status) {
				$scope.searchResults.push(response[0]);
				$scope.pages = [];
				for(var i = 0; i < Math.floor(($scope.searchResults.length - 1)/ 12) + 1; i++)
					$scope.pages[i] = i + 1;
			});
		})
	}
	
	$scope.deleteRecipe = function(ID, name) {
		var urlStr = "http://192.168.33.10:8080/api/recipe/" + ID;
		$http.delete(urlStr);
		var temp = $scope.searchResults.length;
		for(var i = 0; i < $scope.searchResults.length; i++)
			if ($scope.searchResults[i]._id == name._id) {
				$scope.searchResults.splice(i, 1);
				break;
			}
		$scope.pages = [];
		if (Math.floor((temp - 1)/ 12) != (Math.floor(($scope.searchResults.length - 1)/ 12))) {
			if (temp != 1) {
				$scope.page -= 1;
				$scope.currentpage -= 1;
			}
		}
		for(var i = 0; i < Math.floor(($scope.searchResults.length - 1)/ 12) + 1; i++)
			$scope.pages[i] = i + 1;
		//$scope.searchResults.splice(name, 1);
	}
});

app.filter('maxnumber', function() {
	return function(input, maxtime) {
		var out = [];
		angular.forEach(input, function(recipe) {
			if (recipe.time <= maxtime) out.push(recipe);
		});
		console.log(out);
		return out;
	}
})


app.controller('recipeCtrl2', function($scope, $http, $routeParams) {
	//console.log($routeParams);
	$http.get("http://192.168.33.10:8080/api/recipe/" + $routeParams.id).success(function(response, status) {
	//console.log(response);
		$scope.recipedetail = response;
		$scope.updatetitle = response[0].title;
		$scope.updatetime = response[0].time;
		$scope.updatetags = response[0].tags.join(',');
		$scope.updateinstruction = response[0].instructions;
	});
	
	var serialize = function(obj, prefix) {
	  	var str = [];
	  	for(var p in obj) {
	   	 	if (obj.hasOwnProperty(p)) {
	      		var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
	      		str.push(typeof v == "object" ?
	        	serialize(v, k) :
	        	encodeURIComponent(k) + "=" + encodeURIComponent(v));
	   		 }
	  	}
	  return str.join("&");
	}
	
	$scope.updateRecipe = function() {
		var queryObj = {};
		queryObj.title = $scope.updatetitle;
		queryObj.tag = $scope.updatetags.split(',');
		queryObj.time = $scope.updatetime;
		queryObj.instructions = $scope.updateinstruction;
		/*
		queryObj.qty = queryObj.unit = queryObj.ingredient = [];
		for(var i = 0; i < $scope.recipedetail[0].ingredients.length; i++) {
			queryObj.qty.push($scope.recipedetail[0].ingredients[i].qty);
			queryObj.unit.push($scope.recipedetail[0].ingredients[i].units);
			queryObj.ingredient.push($scope.recipedetail[0].ingredients[i].ingredient);
		}
		*/
		var queryStr = serialize(queryObj);
		var urlStr = "http://192.168.33.10:8080/api/recipe/" + $routeParams.id + '?' + queryStr;
		var temp = $http({
			method : 'PUT',
			url : urlStr
		});
		temp.success(function(response, status) {
			$scope.recipedetail[0].title = queryObj.title;
			$scope.recipedetail[0].tags = queryObj.tag;
			$scope.recipedetail[0].time = queryObj.time;
			$scope.recipedetail[0].instructions = queryObj.instructions;
		});
	}
});
