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
	.when('/register', {
            controller: 'RegisterController',
            templateUrl: 'register/register.view.html',
            controllerAs: 'vm'
        })
 	.otherwise({ redirectTo: '/home' });
}]);
