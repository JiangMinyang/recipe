var app = angular.module('recipeManager', ['ngRoute']).
	config(function($routeProvider) {
		$routeProvider.
			when('/recipes', { templateUrl: './partials/Mainrecipe.html', controller : 'recipeCtrl'}).
			when('/recipes/recipename', {templateUrl : './partials/recipe.html', controller : 'recipeCtrl'}).
			otherwise({ redirectTo : '/recipes'} );
	});

app.controller('recipeCtrl', function($scope, $http){
	$scope.addedTags = ['Added:'];
	$scope.tagg = '';
	$scope.qty = '';
	$scope.unit = '';
	$scope.ingre = '';
	$scope.addingIngredient = {};
	$scope.addingIngredient.qty = [];
	$scope.addingIngredient.unit = [];
	$scope.addingIngredient.ingre = [];
	$scope.detail = {};
	//console.log(typeof($scope.addingIngredient) + "11111");
	$http.get("http://localhost:8080/api/recipe?page=1").success(function(response, status) {
		//console.log(response);
		$scope.searchResults = response;
	})
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
	
	$scope.getDetail = function(ID) {
		var urlStr = "http://localhost:8080/api/recipe/" + ID;
		console.log(urlStr);
		var temp = $http.get(urlStr);
		temp.success(function(response, status) {
			//console.log(response);
			$scope.detail = response;
			console.log($scope.detail);
		});

	}
});

