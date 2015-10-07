(function(){
	'use strict';
	
	angular.module('DealersApp', ['ngRoute', 'ngCookies', 'ui.bootstrap'])
	.run(['$rootScope', '$location', '$cookies', '$http', function($rootScope, $location, $cookies, $http) {
		
		// global variables
		$rootScope.baseUrl = 'http://api.dealers-web.com';
		
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Authorization ' + $rootScope.globals.currentUser.token;
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/home', '/login', '/sign-up']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
	}]);
	
})();
