(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('CategoryDealsController', ['$scope', '$routeParams', 'Deal', 'DealInfo', function ($scope, $routeParams, Deal, DealInfo) {
		/**
		 * The controller that manages the Category Deals view.
		 */
		var ctrl = this;
		var category = $routeParams.category;
		$scope.deals = [];
		$scope.errorMessage;
		$scope.status = 'loading';
		
		$scope.update = {};
		$scope.update.loadingMore = false;
		$scope.update.nextPage;
		
		$scope.getDeals = getDeals;
		$scope.getDeals();
				
		function getDeals(nextPage) {
			
			var nextParam;
			var url = '/category_deals/?category=' + Deal.categoryKey(category);

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

			Deal.getDeals(url)
			.then(function (result) {
				$scope.status = 'downloaded';
				mapDealData(result.data.results);
				var deals = result.data.results;
				if (deals.length > 0) {
					$scope.deals.push.apply($scope.deals, deals);
					$scope.update.nextPage = result.data.next;
				} else {
					$scope.message = "Currently there are no deals in " + category + "...";
				}
				$scope.update.loadingMore = false;
			}, function (httpError) {
				$scope.status = 'failed';
				$scope.errorMessage = "Couldn't download the deals";
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
			    deal = Deal.mapData(deal);
			}
		}
	}]);
})();