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
        templateUrl: 'app/components/signed-out/login/login.view.html',
        controller: 'LoginController',
        controllerAs: 'lgCtrl'
       	})
	.when('/sign-up', {
        templateUrl: 'app/components/signed-out/sign-up/sign-up.view.html',
        controller: 'SignUpController',
        controllerAs: 'suCtrl'
        })
    .when('/my-feed', {
        templateUrl: 'app/components/signed-in/my-feed/my-feed.view.html',
        controller: 'MyFeedController',
        controllerAs: 'mfCtrl'
        })
    .when('/deals/:dealID', {
        templateUrl: 'app/components/signed-in/view-deal/view-deal.view.html',
        controller: 'ViewDealController',
        controllerAs: 'vdCtrl'
      })
 	.otherwise({ redirectTo: '/home' });
}]);
