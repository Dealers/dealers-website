/*
 *  Contains methods for downloading users' info, authenticating users and registering new users.
 */

(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('Dealer', DealerFactory);
	
	DealerFactory.$inject = ['$http', '$rootScope', 'Authentication'];
	function DealerFactory($http, $rootScope, Authentication) {
		
		this.saveCurrent = saveCurrent;
		this.setCredentials = setCredentials;
		this.broadcastResult = broadcastResult;
		
		var ctrl = this;
		var service = {};
		
		service.create = create;
		service.login = login;
		service.logOut = logOut;
		service.getDealer = getDealer;
		
		return service;
				
		function create(dealer) {
			return $http.post($rootScope.baseUrl + '/addcomments/', comment);
		}
		
		function login(username, password) {
			var credentials = Authentication.getCredentials(username, password);
			$http.get($rootScope.baseUrl + '/dealerlogins/', {
				headers: {'Authorization': credentials}
			})
			.then(function (response) {
                // success
                var dealer = response.data.results[0];
                ctrl.saveCurrent(dealer);
                ctrl.setCredentials(username, password);
            },
            function (httpError) {
              	// error
              	console.log(httpError.status + " : " + httpError.data);
              	ctrl.broadcastResult('login', false, httpError.data.detail);
            });
		}
		
		function logOut() {
			Authentication.clearCredentials();
			localStorage.clear();
		}
				
		function saveCurrent(dealer) {
			if (dealer) {
				localStorage.setItem('dealer', JSON.stringify(dealer));
				$rootScope.dealer = dealer;
			}
		}
		
		function setCredentials(username, password) {
			Authentication.getToken(username, password)
			.then(function (response) {
				// success
              	console.log("Set credentials successfully! Get in!");
				Authentication.saveCredentials(username, response.data.token);
				ctrl.broadcastResult('credentials-set', true);
			},
			function (httpError) {
				console.log("Couldn't get token:" + httpError);
				ctrl.broadcastResult('credentials-set', false);
			});
		}
		
		function broadcastResult(process, success, message) {
			$rootScope.$broadcast(process, {success: success, message: message});
		}
		
		function getDealer(dealerID) {
			/**
			 * Downloads the dealer's information according to the received dealer id.
			 */
			return $http.get($rootScope.baseUrl + '/dealers/' + dealerID + '/');
		}
	}
	
})();