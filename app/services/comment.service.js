(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('Comment', CommentFactory);
	
	CommentFactory.$inject = ['$http', '$rootScope', 'Authentication'];
	function CommentFactory($http, $rootScope, Authentication) {
		
		var ctrl = this;
		var service = {};
		
		service.postComment = postComment;
		service.getProducts = getProducts;
		service.mapData = mapData;
		
		return service;
		
		function postComment(comment) {
			/*
			 * Posts a comment to the server
			 */
			if (comment) {
				
				return $http.get($rootScope.baseUrl + '/alldeals/' + String(dealID) + '/');
			}
		}
		
		function getDeals(from) {
			/*
			 * Returns a call for a list of products form the server
			 */
			return $http.get($rootScope.baseUrl + from);	
		}
		
		function mapData(product) {
			/*
			 * Converts the keys of the server to regular strings, and returns the updated product.
			 */
			var categories = {
	            "Fa": "Fashion", 	
	            "Au" : "Automotive",
	            "Ar" : "Art",
	            "Be" : "Health & Beauty",
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
			if (product.category) {
				var category = categories[product.category];
				if (category) {
					product.category = category;
				}
				return product;
			}
		}
	}
})();