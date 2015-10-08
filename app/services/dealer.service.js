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
		
		return service;
				
		function create(dealer) {
			var credentials = Authentication.getCredentials("ubuntu", "090909deal");
			$http.post($rootScope.baseUrl + '/dealers/', dealer, {
				headers: {'Authorization': credentials}
			})
			.then(function (response) {
                // success
				var newDealer = response.data;
                ctrl.saveCurrent(newDealer);
                ctrl.setCredentials(dealer.user.username, dealer.user.password);
              },
              function (httpError) {
              	// error
              	console.log(httpError.status + " : " + httpError.data);
              	var errorString;
              	if (httpError.data.user[0]) {
              		var usernameError = httpError.data.user[0];
              		errorString = usernameError.username[0];
              	} else {
					errorString = "Couldn't sign up, please try again!";
              	}
              	ctrl.broadcastResult('sign-up', false, errorString);
              });
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
	}
	
})();