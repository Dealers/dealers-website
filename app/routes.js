angular.module('DealersApp')
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	
	
	// Signed Out
	
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
        
        
	// Signed In
        
    .when('/my-feed', {
        templateUrl: 'app/components/signed-in/views/deals-grid.view.html',
        controller: 'DealsGridController',
        controllerAs: 'mfCtrl'
        })
    .when('/search/deals/:query', {
        templateUrl: 'app/components/signed-in/views/deals-grid.view.html',
        controller: 'DealsGridController',
        controllerAs: 'mfCtrl'
        })
    .when('/categories', {
        templateUrl: 'app/components/signed-in/views/categories-list.view.html',
        controller: 'CategoriesListController',
        controllerAs: 'clCtrl'
        })
    .when('/categories/:category', {
        templateUrl: 'app/components/signed-in/views/deals-grid.view.html',
        controller: 'DealsGridController',
        controllerAs: 'dgCtrl'
        })
    .when('/deals/:dealID', {
        templateUrl: 'app/components/signed-in/views/view-deal.view.html',
        controller: 'ViewDealController',
        controllerAs: 'vdCtrl'
      })
      .when('/dealers/:dealerID', {
        templateUrl: 'app/components/signed-in/views/profile.view.html',
        controller: 'ProfileController',
        controllerAs: 'prCtrl'
      })
 	.otherwise({ redirectTo: '/home' });
}]);
