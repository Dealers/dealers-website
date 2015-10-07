angular.module('DealersApp')
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/home', {
		templateUrl: 'app/components/signed-out/home/home.view.html',
		controller: 'HomeController',
		controllerAs: 'homeCtrl'
		})
	.when('/', { redirectTo: '/home' })
	.when('/login', {
            controller: 'LoginController',
            templateUrl: 'app/components/signed-out/login/login.view.html',
            controllerAs: 'lgCtrl'
       	})
	.when('/sign-up', {
            controller: 'SignUpController',
            templateUrl: 'app/components/signed-out/sign-up/sign-up.view.html',
            controllerAs: 'suCtrl'
        })
    .when('/my-feed', {
            controller: 'MyFeedController',
            templateUrl: 'app/components/signed-in/my-feed/my-feed.view.html',
            controllerAs: 'mfCtrl'
        })
 	.otherwise({ redirectTo: '/home' });
}]);
