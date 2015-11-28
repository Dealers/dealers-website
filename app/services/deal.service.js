(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('Deal', DealFactory);
	
	DealFactory.$inject = ['$http', '$rootScope', 'Authentication'];
	function DealFactory($http, $rootScope, Authentication) {
		
		var ctrl = this;
		var service = {};
		
		service.getDeals = getDeals;
		
		return service;
		
		function getDeals(from) {
			return $http.get($rootScope.baseUrl + from);	
		}
	}
})();