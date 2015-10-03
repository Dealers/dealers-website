angular.module('DealersApp')
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/home', {
		templateUrl: 'app/components/signed-out/home/home.view.html',
		controller: 'HomeController',
		controllerAs: 'homeCtrl'
		})
	.when('/', {
	        templateUrl: 'app/components/signed-out/home/home.view.html',
	        controller: 'HomeController',
	        controllerAs: 'homeCtrl'
        })
	.when('/login', {
            controller: 'LoginController',
            templateUrl: 'login/login.view.html',
            controllerAs: 'vm'
       	})
	.when('/sign-up', {
            controller: 'SignUpController',
            templateUrl: 'app/components/signed-out/sign-up/sign-up.view.html',
            controllerAs: 'suCtrl'
        })
 	.otherwise({ redirectTo: '/home' });
}]);
