(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('Dealer', DealerFactory);
	
	DealerFactory.$inject = ['$http', '$rootScope', 'Authentication'];
	function DealerFactory($http, $rootScope, Authentication) {
		var service = {};
		service.create = create;
		service.login = login;
		service.setCredentials = setCredentials;
		service.saveCurrent = saveCurrent;
		service.getCurrent = getCurrent;
		
		return service;
				
		function create(dealer) {
			var credentials = Authentication.getCredentials("ubuntu", "090909deal");
			return $http.post(baseUrl + '/dealers/', dealer, {
				headers: {'Authorization': credentials}
			});
		}
		
		function login(username, password) {
			var credentials = Authentication.getCredentials(username, password);
			return $http.get($rootScope.baseUrl + '/dealerlogins/', {
				headers: {'Authorization': credentials}
			});
		}
		
		function setCredentials(username, password) {
			Authentication.getToken(username, password)
			.then(function (response) {
				// success
				Authentication.saveCredentials(username, response.data.token);
				$rootScope.$broadcast('credentials-set', {success: true});
			},
			function (httpError) {
				console.log("Couldn't get token:" + httpError);
				$rootScope.$broadcast('credentials-set', {success: false});
			});
		}
				
		function saveCurrent(dealer) {
			if (dealer) {
				localStorage.setItem('dealer', JSON.stringify(dealer));
				$rootScope.dealer = dealer;
			}
		}
		
		function getCurrent() {
			var dealer;
			var dealerString = localStorage.getItem('dealer');
			if (dealerString && dealerString.length > 0) {
				dealer = JSON.parse(dealerString);
				$rootScope.globals.dealer = dealer;
				return $rootScope.globals.dealer;
			} else {
				return null;
			}
		}
	}
	
})();