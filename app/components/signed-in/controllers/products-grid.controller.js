(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('ProductsGridController', ['$scope', '$rootScope', '$routeParams', 'Product', function ($scope, $rootScope, $routeParams, Product) {
		/**
		 * The controller that manages the My Feed view.
		 */
		var ctrl = this;
		var mode;
		var url = $rootScope.baseUrl;
		var routeParams;
		var noProductsMessage;
		
		$scope.products = [];
		$scope.message = "";
		$scope.status = 'loading';
		
		$scope.update = {};
		$scope.update.loadingMore = false;
		$scope.update.nextPage = "";
		$scope.getProducts = getProducts;
		
		if ($routeParams.query) {
			// This is a search session, should get the products according to the search term.
			mode = "search";
			routeParams = $routeParams.query;
			url += '/dealsearch/?search=' + routeParams;
			noProductsMessage = "Didn't find any results for '" + routeParams + "'.";
		} else if ($routeParams.category) {
			// This is a search session, should get the products according to the search term.
			mode = "category";
			routeParams = $routeParams.category;
			url += '/category_deals/?category=' + Product.keyForCategory(routeParams);
			noProductsMessage = "Currently there are no products in " + routeParams + "...";
			$scope.title = routeParams;
		} else {
			// This is a My Feed session, should get the products from the my-feed endpoint.
			mode = "myFeed";
			url += '/my_feeds/';
			noProductsMessage = "We couldn't find any products that match your interest :(";
		}
		
		
		$scope.getProducts();
		
		
		function getProducts(nextPage) {
			
			// Checking if asking for another page
			if (nextPage) {
				url = nextPage;
			}

			Product.getProducts(url)
			.then(function (result) {
				$scope.status = 'downloaded';
				var products = result.data.results;
				mapProductData(products);
				if (products.length > 0) {
					$scope.products.push.apply($scope.products, products);
					$scope.update.nextPage = result.data.next;
				} else {
					$scope.message = noProductsMessage;
				}
				$scope.update.loadingMore = false;
			}, function (httpError) {
				$scope.status = 'failed';
				$scope.message = "Couldn't download the products";
				$scope.errorPrompt =  "Please try again...";
				$scope.update.loadingMore = false;
			});
		}
		
		function getPageParams(nextPage) {
			var paramsIndex = nextPage.indexOf("page") + 1; // +1 to get rid of the redundant backslash before the questionmark
			var paramsString;
			if (paramsIndex != -1) {
				paramsString = nextPage.substring(paramsIndex);
			}
			return paramsString;
		}	
		
		function mapProductData(data) {
			/*
			 * Map the data that should be converted from server keys to regular strings.
			 */
			for (var i = 0; i < data.length; i++) {
			    var prodcut = data[i];
			    prodcut = Product.mapData(prodcut);
			}
		}
	}]);
})();