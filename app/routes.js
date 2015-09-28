angular.module('DealersApp')
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/home', {
		templateUrl: 'app/components/home/home.view.html',
		controller: 'app/components/home/home.controller.js',
		controllerAs: 'homeCtrl'
		})
	.when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
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
