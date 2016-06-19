/*
 *  Contains valueable constants regarding the deal's information.
 */

(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('ProductInfo', ProductInfoFactory);
	
	ProductInfoFactory.$inject = ['$http', '$rootScope', 'Authentication'];
	function ProductInfoFactory($http, $rootScope, Authentication) {
		
		var ctrl = this;
		var service = {};
		
		// dictionaries
		var currencies = {
			'USD': '$',
			'ILS': '₪',
			'CNY': '¥',
			'GBP': '£',
			'EUR': '€'
		};
		
		service.currencyForKey = currencyForKey;
		service.getDummyProducts = getDummyProducts;
		
		return service;
		
		function currencyForKey(key) {
			return currencies[key];
		}
		
		function getDummyProducts() {
			var products = [];
			var product = {};
			product.store = {};		
			product.title = "Great product now at Zara with great accessories and stuff";
		    product.price = Number(15);
		    product.currency = "DO";
		    product.expiration = new Date();
		    product.store.name = "Zara, Raanana";
		    product.photoURL1 = "jdsfjkdsf;";
		    
		    products.push(product);
		    
		    product = {};
		    product.store = {};
		    product.title = "Wow come see what I found here";
		    product.price = Number(266);
		    product.currency = "SH";
		    product.expiration = new Date();
		    product.store.name = "Shekem Electric";
		    product.photoURL1 = "jdsfjkdsf;";
		    product.dealattribs = {};
		    product.dealattribs.dealers_that_liked = [2, 4, 14];
		    
		    products.push(product);
		    
		    product = {};
		    product.store = {};
		    product.title = "1+1 on al hamburgers at McDonalds... Yam Yam!";
		    product.store.name = "McDonalds, Kiryat Mozkin Krayot";
		    product.photoURL1 = "jdsfjkdsf;";
		    
		    products.push(product);
		    
		    product = {};
		    product.store = {};
		    product.title = "Awesome shoes at nike store";
		    product.price = Number(15);
		    product.currency = "SH";
		    product.store.name = "Nike";
		    product.photoURL1 = "jdsfjkdsf;";
		    
		    products.push(product);
		    
		    return products;	
		}
	}
})();