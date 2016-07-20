angular.module('DealersApp')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'app/components/home/home.view.html',
                controller: 'HomeController'
            })
            .when('/home', {redirectTo: '/'})
            .when('/register', {
                templateUrl: 'app/components/signed-in/views/sign-in/register-as-dealer.view.html',
                controller: 'RegisterAsDealerController'
            })
            .when('/search/products/:query', {
                templateUrl: 'app/components/signed-in/views/products/products-page.view.html',
                controller: 'ProductsGridController',
                controllerAs: 'mfCtrl'
            })
            .when('/categories', {
                templateUrl: 'app/components/signed-in/views/categories-list.view.html',
                controller: 'CategoriesListController',
                controllerAs: 'clCtrl'
            })
            .when('/categories/:category', {
                templateUrl: 'app/components/signed-in/views/products/products-page.view.html',
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
                templateUrl: 'app/components/signed-in/views/products/add-product-1.view.html',
                controller: 'AddProduct1Controller',
                controllerAs: 'ap1Ctrl'
            })
            .when('/new-product/more-details', {
                templateUrl: 'app/components/signed-in/views/products/add-product-2.view.html',
                controller: 'AddProduct2Controller',
                controllerAs: 'ap2Ctrl'
            })
            .when('/new-product/spread-the-word', {
                templateUrl: 'app/components/signed-in/views/products/add-product-3.view.html',
                controller: 'AddProduct3Controller',
                controllerAs: 'ap3Ctrl'
            })
            .when('/edit-product/:productID', {
                templateUrl: 'app/components/signed-in/views/products/edit-product.view.html',
                controller: 'EditProductController',
                controllerAs: 'epCtrl'
            })
            .when('/done-registration', {
                templateUrl: 'app/components/signed-in/views/sign-in/done-registration.view.html'
            })
            .when('/products/:productID/checkout', {
                templateUrl: 'app/components/signed-in/views/checkout.view.html',
                controller: 'CheckoutController'
            })
            .when('/products/:productID/checkout-finish', {
                templateUrl: 'app/components/signed-in/views/checkout-finish.view.html',
                controller: 'CheckoutFinishController'
            })
            .when('/purchase/:purchaseID', {
                templateUrl: 'app/components/signed-in/views/purchases/purchase-details.view.html',
                controller: 'PurchaseDetailsController'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);

    }]);
