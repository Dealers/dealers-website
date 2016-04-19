angular.module('DealersApp')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider


        // Signed Out

            .when('/home', {
                templateUrl: 'app/components/signed-out/home/home.view.html',
                controller: 'HomeController',
                controllerAs: 'homeCtrl'
            })
            .when('/', {redirectTo: '/home'})
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
                templateUrl: 'app/components/signed-in/views/products-grid.view.html',
                controller: 'ProductsGridController',
                controllerAs: 'mfCtrl'
            })
            .when('/search/products/:query', {
                templateUrl: 'app/components/signed-in/views/products-grid.view.html',
                controller: 'ProductsGridController',
                controllerAs: 'mfCtrl'
            })
            .when('/categories', {
                templateUrl: 'app/components/signed-in/views/categories-list.view.html',
                controller: 'CategoriesListController',
                controllerAs: 'clCtrl'
            })
            .when('/categories/:category', {
                templateUrl: 'app/components/signed-in/views/products-grid.view.html',
                controller: 'ProductsGridController',
                controllerAs: 'dgCtrl'
            })
            .when('/products/:productID', {
                templateUrl: 'app/components/signed-in/views/view-deal.view.html',
                controller: 'ViewDealController',
                controllerAs: 'vdCtrl'
            })
            .when('/dealers/:dealerID', {
                templateUrl: 'app/components/signed-in/views/profile.view.html',
                controller: 'ProfileController',
                controllerAs: 'prCtrl'
            })
            .when('/new-product/basic-info', {
                templateUrl: 'app/components/signed-in/views/add-product-1.view.html',
                controller: 'AddProduct1Controller',
                controllerAs: 'ap1Ctrl'
            })
            .when('/new-product/more-details', {
                templateUrl: 'app/components/signed-in/views/add-product-2.view.html',
                controller: 'AddProduct2Controller',
                controllerAs: 'ap2Ctrl'
            })
            .when('/new-product/spread-the-word', {
                templateUrl: 'app/components/signed-in/views/add-product-3.view.html',
                controller: 'AddProduct3Controller',
                controllerAs: 'ap3Ctrl'
            })
            .when('/edit-product/:productID', {
                templateUrl: 'app/components/signed-in/views/edit-product.view.html',
                controller: 'EditProductController',
                controllerAs: 'epCtrl'
            })
            .otherwise({redirectTo: '/home'});
    }]);
