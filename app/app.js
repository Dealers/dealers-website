(function(){
	'use strict';
	
	angular.module('DealersApp', ['ngRoute', 'ngCookies', 'ui.bootstrap'])
	.run(['$rootScope', '$location', '$cookies', '$http', function($rootScope, $location, $cookies, $http) {
		
		// global variables
		$rootScope.baseUrl = 'http://api.dealers-web.com';
		
        // keep user logged in after page refresh
        if ($cookies.get('globals') !== '[object Object]') { // checking if there's an object in the cookies key
        	$rootScope.globals = $cookies.getObject('globals') || {};
        
	        if ($rootScope.globals.currentUser) {
	            $http.defaults.headers.common['Authorization'] = 'Authorization ' + $rootScope.globals.currentUser.token;
	            // get the dealer object from the local storage
	            var dealerString = localStorage.getItem('dealer');
	            if (dealerString) {
	            	$rootScope.dealer = JSON.parse(dealerString);
	            }
	        }
 		}
 		
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/home', '/login', '/sign-up']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/home');
            } else if (!restrictedPage && loggedIn) {
            	$location.path('/my-feed');
            }
        });
	}]);
})();
