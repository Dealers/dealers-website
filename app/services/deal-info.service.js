(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('DealInfo', DealInfoFactory);
	
	DealInfoFactory.$inject = ['$http', '$rootScope', 'Authentication'];
	function DealInfoFactory($http, $rootScope, Authentication) {
		
		var ctrl = this;
		var service = {};
		
		// dictionaries
		var currencies = {
			'DO': '$',
			'SH': '₪',
			'YE': '¥',
			'YU': '¥',
			'PO': '£',
			'EU': '€'
		};
		
		service.currencyForKey = currencyForKey;
		service.getDummyDeals = getDummyDeals;
		
		return service;
		
		function currencyForKey(key) {
			var currency = currencies[key];
			return currency;
		}
		
		function getDummyDeals() {
			var deals = [];
			var deal = {};
			deal.store = {};		
			deal.title = "Great deal now at Zara with great accessories and stuff";
		    deal.price = Number(15);
		    deal.currency = "DO";
		    deal.expiration = new Date();
		    deal.store.name = "Zara, Raanana";
		    deal.photoURL1 = "jdsfjkdsf;";
		    
		    deals.push(deal);
		    
		    deal = {};
		    deal.store = {};
		    deal.title = "Wow come see what I found here";
		    deal.price = Number(266);
		    deal.currency = "SH";
		    deal.expiration = new Date();
		    deal.store.name = "Shekem Electric";
		    deal.photoURL1 = "jdsfjkdsf;";
		    deal.dealattribs = {};
		    deal.dealattribs.dealers_that_liked = [2, 4, 14];
		    
		    deals.push(deal);
		    
		    deal = {};
		    deal.store = {};
		    deal.title = "1+1 on al hamburgers at McDonalds... Yam Yam!";
		    deal.store.name = "McDonalds, Kiryat Mozkin Krayot";
		    deal.photoURL1 = "jdsfjkdsf;";
		    
		    deals.push(deal);
		    
		    deal = {};
		    deal.store = {};
		    deal.title = "Awesome shoes at nike store";
		    deal.price = Number(15);
		    deal.currency = "SH";
		    deal.store.name = "Nike";
		    deal.photoURL1 = "jdsfjkdsf;";
		    
		    deals.push(deal);
		    
		    return deals;	
		}
	}
})();