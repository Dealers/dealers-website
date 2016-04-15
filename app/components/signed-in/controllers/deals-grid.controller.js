(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('DealsGridController', ['$scope', '$rootScope', '$routeParams', 'Deal', function ($scope, $rootScope, $routeParams, Deal) {
		/**
		 * The controller that manages the My Feed view.
		 */
		var ctrl = this;
		var mode;
		var url = $rootScope.baseUrl;
		var routeParams;
		var noDealsMessage;
		
		$scope.deals = [];
		$scope.message;
		$scope.status = 'loading';
		
		$scope.update = {};
		$scope.update.loadingMore = false;
		$scope.update.nextPage;
		$scope.getDeals = getDeals;
		
		if ($routeParams.query) {
			// This is a search session, should get the deals according to the search term.
			mode = "search";
			routeParams = $routeParams.query;
			url += '/dealsearch/?search=' + routeParams;
			noDealsMessage = "Didn't find any results for '" + routeParams + "'.";
		} else if ($routeParams.category) {
			// This is a search session, should get the deals according to the search term.
			mode = "category";
			routeParams = $routeParams.category;
			url += '/category_deals/?category=' + Deal.keyForCategory(routeParams);
			noDealsMessage = "Currently there are no deals in " + routeParams + "...";
			$scope.title = routeParams;
		} else {
			// This is a My Feed session, should get the deals from the my-feed endpoint.
			mode = "myFeed";
			url += '/my_feeds/';
			noDealsMessage = "We couldn't find any deals that match your interest :(";
		}
		
		
		$scope.getDeals();
		
		
		function getDeals(nextPage) {
			
			// Checking if asking for another page
			if (nextPage) {
				url = nextPage;
			}
			
			Deal.getDeals(url)
			.then(function (result) {
				$scope.status = 'downloaded';
				var deals = result.data.results;
				mapDealData(deals);
				if (deals.length > 0) {
					$scope.deals.push.apply($scope.deals, deals);
					$scope.update.nextPage = result.data.next;
				} else {
					$scope.message = noDealsMessage;
				}
				$scope.update.loadingMore = false;
			}, function (httpError) {
				$scope.status = 'failed';
				$scope.message = "Couldn't download the deals";
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
		
		function mapDealData(data) {
			/*
			 * Map the data that should be converted from server keys to regular strings.
			 */
			for (var i = 0; i < data.length; i++) {
			    var deal = data[i];
			    deal = Deal.mapData(deal);
			}
		}
	}]);
})();