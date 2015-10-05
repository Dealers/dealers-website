(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('Dealer', DealerFactory);
	
	DealerFactory.$inject = ['$http', 'Authentication'];
	function DealerFactory($http, Authentication) {
		var service = {};
		service.create = create;
		
		return service;
		
		function create(dealer) {
			var credentials = Authentication.getCredentials("ubuntu", "090909deal");
			return $http.post('http://api.dealers-web.com/dealers/', dealer, {
				headers: {'Authorization': credentials}
			});
		}
	}
	
})();