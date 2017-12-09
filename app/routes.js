angular.module('DealersApp')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'app/components/views/home.view.html',
                controller: 'HomeController',
            })
            .when('/home', {
                templateUrl: 'app/components/views/home.view.html',
                controller: 'HomeController',
                pageTrack: '/home' // angular-google-analytics extension
            })
            .when('/(?:all-products|Everything', {
                templateUrl: 'app/components/views/home.view.html',
                controller: 'ProductsGridController',
                pageTrack: '/all-products' // angular-google-analytics extension
            })
            .when('/register/basic-info', {
                templateUrl: 'app/components/views/sign-in/register-basic-info.view.html',
                controller: 'RegisterBasicInfoController',
                pageTrack: '/register-basic-info'  // angular-google-analytics extension
            })
            .when('/register/bank-account', {
                templateUrl: 'app/components/views/sign-in/register-bank-account.view.html',
                controller: 'RegisterBankAccountController',
                pageTrack: '/register-bank-account'  // angular-google-analytics extension
            })
            .when('/register/price-plans', {
                templateUrl: 'app/components/views/sign-in/register-price-plans.view.html',
                controller: 'RegisterPricePlansController',
                pageTrack: '/register-price-plans'  // angular-google-analytics extension
            })
            .when('/search/products/:query', {
                templateUrl: 'app/components/views/products/products-page.view.html',
                controller: 'ProductsGridController',
                pageTrack: '/search/products'  // angular-google-analytics extension
            })
            .when('/categories', {
                templateUrl: 'app/components/views/categories-list.view.html',
                controller: 'CategoriesListController',
                pageTrack: '/categories'  // angular-google-analytics extension
            })
            .when('/categories/:category', {
                templateUrl: 'app/components/views/products/products-page.view.html',
                controller: 'ProductsGridController',
                pageTrack: '/categories'  // angular-google-analytics extension
            })
            .when('/products/:productID', {
                templateUrl: 'app/components/views/view-deal.view.html',
                controller: 'ViewDealController',
                pageTrack: '/product'  // angular-google-analytics extension
            })
            .when('/dealers/:dealerID', {
                templateUrl: 'app/components/views/profile.view.html',
                controller: 'ProfileController',
                pageTrack: '/profile'  // angular-google-analytics extension
            })
            .when('/dealers/:dealerID/sales', {
                templateUrl: 'app/components/views/profile.view.html',
                controller: 'ProfileController',
                reloadOnSearch: false,
                pageTrack: '/profile-sales'  // angular-google-analytics extension
            })
            .when('/dealers/:dealerID/orders', {
                templateUrl: 'app/components/views/profile.view.html',
                controller: 'ProfileController',
                reloadOnSearch: false,
                pageTrack: '/profile-orders'  // angular-google-analytics extension
            })
            .when('/edit-profile/:dealerID', {
                templateUrl: 'app/components/views/edit-profile.view.html',
                controller: 'EditProfileController',
                pageTrack: '/edit-profile'  // angular-google-analytics extension
            })
            .when('/new-product', {
                templateUrl: 'app/components/views/products/add-product.view.html',
                controller: 'AddProductController',
                pageTrack: '/add-product'  // angular-google-analytics extension
            })
            .when('/new-product/spread-the-word', {
                templateUrl: 'app/components/views/products/add-product-finish.view.html',
                controller: 'AddProductFinishController',
                pageTrack: '/add-product-finish'  // angular-google-analytics extension
            })
            .when('/edit-product/:productID', {
                templateUrl: 'app/components/views/products/edit-product.view.html',
                controller: 'EditProductController',
                pageTrack: '/edit-product'  // angular-google-analytics extension
            })
            .when('/done-registration', {
                templateUrl: 'app/components/views/sign-in/done-registration.view.html',
                pageTrack: '/dealer-registration-finish'  // angular-google-analytics extension
            })
            .when('/products/:productID/checkout', {
                templateUrl: 'app/components/views/checkout.view.html',
                controller: 'CheckoutController',
                pageTrack: '/checkout'  // angular-google-analytics extension
            })
            .when('/products/:productID/checkout-finish', {
                templateUrl: 'app/components/views/checkout-finish.view.html',
                controller: 'CheckoutFinishController',
                pageTrack: '/checkout-finished'  // angular-google-analytics extension
            })
            .when('/purchase/:purchaseID', {
                templateUrl: 'app/components/views/purchases/purchase-details.view.html',
                controller: 'PurchaseDetailsController',
                pageTrack: '/purchase-details'  // angular-google-analytics extension
            })
            .when('/about', {
                templateUrl: '/app/components/views/about/about.view.html'
            })
            .when('/terms-and-privacy', {
                templateUrl: 'app/components/views/about/terms-and-privacy.view.html'
            })
            .when('/contact', {
                templateUrl: 'app/components/views/about/contact.view.html'
            })
            .when('/security', {
                templateUrl: 'app/components/views/about/security.view.html'
            })
            .when('/help', {
                templateUrl: 'app/components/views/about/help.view.html'
            })
            .when('/step-by-step', {
                templateUrl: 'app/components/views/about/step-by-step.view.html'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);

    }]);
