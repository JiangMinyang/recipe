var app = angular.module('recipeManager', []);

app.controller('recipeCtrl', function($scope, $http){
	$http.get("http://192.168.33.10:8080/api/recipe?page=1").success(function(response, status) {
		console.log(response);
		$scope.searchResults = response;
	})
	$scope.Search = function() {
		var urlStr = "http://192.168.33.10:8080/api/recipe?";
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
});