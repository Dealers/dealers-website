angular.module('DealersApp')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'app/components/home/home.view.html',
                controller: 'HomeController',
                resolveRedirectTo: {
                    isDealerReady: function (RoootDealerReady) {
                        RoootDealerReady.whenReady().then(function (dealer) {
                            if (dealer.role == 'dealer') {
                                return '/dealers/' + dealer.id;
                            } else {
                                return '/home';
                            }
                        });
                    }
                }
            })
            .when('/home', {
                templateUrl: 'app/components/home/home.view.html',
                controller: 'HomeController',
                pageTrack: '/home' // angular-google-analytics extension
            })
            .when('/register', {
                templateUrl: 'app/components/signed-in/views/sign-in/register-as-dealer.view.html',
                controller: 'RegisterAsDealerController',
                pageTrack: '/register-as-dealer'  // angular-google-analytics extension
            })
            .when('/search/products/:query', {
                templateUrl: 'app/components/signed-in/views/products/products-page.view.html',
                controller: 'ProductsGridController',
                pageTrack: '/search/products'  // angular-google-analytics extension
            })
            .when('/categories', {
                templateUrl: 'app/components/signed-in/views/categories-list.view.html',
                controller: 'CategoriesListController',
                pageTrack: '/categories'  // angular-google-analytics extension
            })
            .when('/categories/:category', {
                templateUrl: 'app/components/signed-in/views/products/products-page.view.html',
                controller: 'ProductsGridController',
                pageTrack: '/categories'  // angular-google-analytics extension
            })
            .when('/products/:productID', {
                templateUrl: 'app/components/signed-in/views/view-deal.view.html',
                controller: 'ViewDealController',
                pageTrack: '/product'  // angular-google-analytics extension
            })
            .when('/dealers/:dealerID', {
                templateUrl: 'app/components/signed-in/views/profile.view.html',
                controller: 'ProfileController',
                pageTrack: '/profile'  // angular-google-analytics extension
            })
            .when('/edit-profile/:dealerID', {
                templateUrl: 'app/components/signed-in/views/edit-profile.view.html',
                controller: 'EditProfileController',
                pageTrack: '/edit-profile'  // angular-google-analytics extension
            })
            .when('/new-product', {
                templateUrl: 'app/components/signed-in/views/products/add-product.view.html',
                controller: 'AddProductController',
                pageTrack: '/add-product'  // angular-google-analytics extension
            })
            .when('/new-product/spread-the-word', {
                templateUrl: 'app/components/signed-in/views/products/add-product-finish.view.html',
                controller: 'AddProductFinishController',
                pageTrack: '/add-product-finish'  // angular-google-analytics extension
            })
            .when('/edit-product/:productID', {
                templateUrl: 'app/components/signed-in/views/products/edit-product.view.html',
                controller: 'EditProductController',
                pageTrack: '/edit-product'  // angular-google-analytics extension
            })
            .when('/done-registration', {
                templateUrl: 'app/components/signed-in/views/sign-in/done-registration.view.html'
            })
            .when('/products/:productID/checkout', {
                templateUrl: 'app/components/signed-in/views/checkout.view.html',
                controller: 'CheckoutController',
                pageTrack: '/checkout'  // angular-google-analytics extension
            })
            .when('/products/:productID/checkout-finish', {
                templateUrl: 'app/components/signed-in/views/checkout-finish.view.html',
                controller: 'CheckoutFinishController',
                pageTrack: '/checkout-finished'  // angular-google-analytics extension
            })
            .when('/purchase/:purchaseID', {
                templateUrl: 'app/components/signed-in/views/purchases/purchase-details.view.html',
                controller: 'PurchaseDetailsController',
                pageTrack: '/purchase-details'  // angular-google-analytics extension
            })
            .when('/about', {
                templateUrl: '/app/components/signed-in/views/about/about.view.html'
            })
            .when('/terms-and-privacy', {
                templateUrl: 'app/components/signed-in/views/about/terms-and-privacy.view.html'
            })
            .when('/contact', {
                templateUrl: 'app/components/signed-in/views/about/contact.view.html'
            })
            .when('/security', {
                templateUrl: 'app/components/signed-in/views/about/security.view.html'
            })
            .when('/help', {
                templateUrl: 'app/components/signed-in/views/about/help.view.html'
            })
            .when('/step-by-step', {
                templateUrl: 'app/components/signed-in/views/about/step-by-step.view.html'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);

    }]);
