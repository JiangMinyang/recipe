var app = angular.module('recipeManager', []).
	config(function($routeProvider) {
		$routeProvider.
			when('/recipes', { template: './index.html', controller : 'recipeCtrl'}).
			when('/recipes/recipename', {template : './partials/recipe.html'}).
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
	//console.log(typeof($scope.addingIngredient) + "11111");
	$http.get("http://localhost:8080/api/recipe?page=1").success(function(response, status) {
		console.log(response);
		$scope.searchResults = response;
	})
	$scope.Search = function() {
		var urlStr = "http://localhost:8080/api/recipe?";
		if (typeof($scope.title) != 'undefined') urlStr = urlStr + 'title=' + $scope.title;
		if (typeof($scope.tags) != 'undefined') {
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
		})
	}

	$scope.sortByKey = function() {
		var urlStr = "http://localhost:8080/api/recipe?";
		if (typeof($scope.title) != 'undefined') urlStr = urlStr + 'title=' + $scope.title;
		if (typeof($scope.tags) != 'undefined') {
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
		})
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
});
