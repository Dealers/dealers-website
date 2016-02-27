(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('MyFeedController', ['$scope', 'Deal', 'DealInfo', function ($scope, Deal, DealInfo) {
		/*
		 * The controller that manages the My Feed view.
		 */
		var ctrl = this;
		
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
			var url = '/my_feeds/';

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
				$scope.deals.push.apply($scope.deals, result.data.results);
				$scope.update.nextPage = result.data.next;
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