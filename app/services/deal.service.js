(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('Deal', DealFactory);
	
	DealFactory.$inject = ['$http', '$rootScope', 'Authentication'];
	function DealFactory($http, $rootScope, Authentication) {
		
		var ctrl = this;
		var service = {};
		
		service.getDeal = getDeal;
		service.getDeals = getDeals;
		service.mapData = mapData;
		
		return service;
		
		function getDeal(dealID) {
			/*
			 * Returns a call for a specific deal form the server
			 */
			if (dealID) {
				return $http.get($rootScope.baseUrl + '/alldeals/' + String(dealID) + '/');
			}
		}
		
		function getDeals(from) {
			/*
			 * Returns a call for a list of deals form the server
			 */
			return $http.get($rootScope.baseUrl + from);	
		}
		
		function mapData(deal) {
			/*
			 * Converts the keys of the server to regular strings, and returns the updated deal.
			 */
			var categories = {
	            "Fa": "Fashion", 	
	            "Au" : "Automotive",
	            "Ar" : "Art",
	            "Be" : "Beauty & Personal Care",
	            "Bo" : "Books & Magazines",
	            "El" : "Electronics",
	            "En" : "Entertainment & Events",
	            "Fo" : "Food & Groceries",
	            "Ho": "Home & Furniture",
	            "Ki" : "Kids & Babies",
	            "Mu" : "Music",
	            "Pe" : "Pets",
	            "Re" : "Restaurants & Bars",
	            "Sp" : "Sports & Outdoor",
	            "Tr" : "Travel",
	            "Ot" : "Other"
           	};
			if (deal.category) {
				var category = categories[deal.category];
				if (category) {
					deal.category = category;
				}
				return deal;
			}
		}
	}
})();