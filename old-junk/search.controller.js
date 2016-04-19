(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('SearchController', ['$scope', '$routeParams', 'Product', 'ProductInfo', function ($scope, $routeParams, Product, ProductInfo) {
		/**
		 * The controller that manages the Search view.
		 */
		var ctrl = this;
		
		var query = $routeParams.query;
		$scope.products = [];
		$scope.errorMessage;
		$scope.status = 'loading';
		
		$scope.update = {};
		$scope.update.loadingMore = false;
		$scope.update.nextPage;
		
		$scope.getProducts = getProducts;
		$scope.getProducts();
				
		function getDeals(nextPage) {
			
			var nextParam;
			var url = '/dealsearch/?search=' + query;

			// Checking if asking for another page
			if (nextPage) {
				nextParam = getPageParams(nextPage);
				if (nextParam) {
					url = url + nextParam;
				} else {
					console.log("There was a problem - received nextPage url but didn't find the nextParam in it...");
					return;
				}
			}

			Deal.getProducts(url)
			.then(function (result) {
				$scope.status = 'downloaded';
				mapDealData(result.data.results);
				var deals = result.data.results;
				if (products.length > 0) {
					$scope.products.push.apply($scope.products, products);
					$scope.update.nextPage = result.data.next;
				} else {
					$scope.message = "Didn't find any results for '" + query + "'.";
				}
					$scope.update.loadingMore = false;
			}, function (httpError) {
				$scope.status = 'failed';
				$scope.errorMessage = "Couldn't download the products";
				$scope.errorPrompt =  "Please try again...";
				$scope.update.loadingMore = false;
			});
		}
		
		function getPageParams(nextPage) {
			var paramsIndex = nextPage.indexOf("/?") + 1; // +1 to get rid of the redundant backslash before the questionmark
			var paramsString;
			if (paramsIndex != -1) {
				paramsString = "&" + nextPage.substring(paramsIndex);
			}
			return paramsString;
		}	
		
		function mapDealData(data) {
			/*
			 * Map the data that should be converted from server keys to regular strings.
			 */
			for (var i = 0; i < data.length; i++) {
			    var deal = data[i];
			    product = Deal.mapData(product);
			}
		}
	}]);
})();