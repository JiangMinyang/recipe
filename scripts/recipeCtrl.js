var app = angular.module('recipeManager', ['ngRoute']).
	config(function($routeProvider) {
		$routeProvider.
			when('/recipes', { templateUrl: './partials/Mainrecipe.html', controller : 'recipeCtrl'}).
			when('/recipes/recipename/:id', {templateUrl : './partials/recipe.html', controller : 'recipeCtrl2'}).
			otherwise({ redirectTo : '/recipes'} );
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
	//console.log(typeof($scope.addingIngredient) + "11111");
	$http.get("http://localhost:8080/api/recipe?page=1").success(function(response, status) {
		//console.log(response);
		$scope.searchResults = response;
	});

	$scope.Search = function() {
		var urlStr = "http://localhost:8080/api/recipe?";
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
			//		console.log($scope.searchResults);
		});

	}

	$scope.sortByKey = function() {
		var urlStr = "http://localhost:8080/api/recipe?";
		if (typeof($scope.title) != 'undefined' && $scope.title != '') urlStr = urlStr + 'title=' + $scope.title;
		if (typeof($scope.tags) != 'undefined' && $scope.tags != '') {
			var tag = $scope.tags.split(',');
			if (tag != '') {
				for(var i = 0; i < tag.length; i++)
					urlStr = urlStr + '&tag=' + tag[i];
			}
		}
		urlStr = urlStr + "&sort=" + $scope.sorting;
		if ($scope.maxTime != '') urlStr += "&maxtime=" + $scope.maxTime;
		//console.log(urlStr);
		var temp = $http.get(urlStr);
		temp.success(function(response, status) {
			console.log(response);
			$scope.searchResults = response;
		});
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
		var urlStr = "http://localhost:8080/api/recipe?" + queryStr;
		//var temp = $http.post(urlStr, queryStr);
		var temp = $http({
			method : 'post',
			url : urlStr
		});
		temp.success(function(response, status) {
			$http.get("http://localhost:8080/api/recipe/" + response).success(function(response, status) {
				$scope.searchResults.push(response[0]);
			});
		})
	}
	
	$scope.deleteRecipe = function(ID, name) {
		var urlStr = "http://localhost:8080/api/recipe/" + ID;
		$http.delete(urlStr);
		for(var i = 0; i < $scope.searchResults.length; i++)
			if ($scope.searchResults[i]._id == name._id) {
				$scope.searchResults.splice(i, 1);
				break;
			}
		//$scope.searchResults.splice(name, 1);
	}
});

app.controller('recipeCtrl2', function($scope, $http, $routeParams) {
	//console.log($routeParams);
	$http.get("http://localhost:8080/api/recipe/" + $routeParams.id).success(function(response, status) {
	//console.log(response);
	$scope.recipedetail = response;
	})
});
