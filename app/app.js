angular.module('DealersApp', ['ngAnimate', 'ngRoute', 'ngCookies', 'ngMaterial', 'ui.bootstrap', 'ngImgCrop', 'angular-google-analytics', 'pascalprecht.translate', 'tmh.dynamicLocale'])

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('purple', {
                'default': '500'
            })
            .accentPalette('purple', {
                'default': '500'
            })
    })

    .config(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount({
            tracker: "UA-62425106-3",
            trackEvent: true,
            trackEcommerce: true
        });
        AnalyticsProvider.useECommerce(true, false);
        AnalyticsProvider.setCurrency('ILS');
        AnalyticsProvider.readFromRoute(true);
    })

    .config(function ($translateProvider, tmhDynamicLocaleProvider) {
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useStaticFilesLoader({
            prefix: 'resources/locale-',// path to translations files
            suffix: '.json'// suffix, currently- extension of the translations
        });
        $translateProvider.registerAvailableLanguageKeys(['he', 'en'], {
            'he*': 'he',
            'en*': 'en'
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.fallbackLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.useLocalStorage();// saves selected language to localStorage
        tmhDynamicLocaleProvider.localeLocationPattern('/assets/locales/angular-locale_{{locale}}.js');
    })

    .constant('LOCALES', {
        'locales': {
            'he': 'עברית',
            'en': 'English'
        },
        'localeFlags': {
            'עברית': '/assets/images/icons/@2x/flag-israel.png',
            'English': '/assets/images/icons/@2x/flag-usa.png'
        },
        'preferredLocale': 'en'
    })

    .filter('htmlEscape', function () {
        return function (input) {
            if (input) {
                return input.replace("&amp;", "&");
            }
        }
    })

    .filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }])

    .run(['$rootScope', '$location', '$cookies', '$http', '$timeout', '$mdToast', 'DealerPhotos', 'Analytics', '$translate', '$translateLocalStorage',
        function ($rootScope, $location, $cookies, $http, $timeout, $mdToast, DealerPhotos, Analytics, $translate, $translateLocalStorage) {

            // global constants
            $rootScope.language = "";
            // $rootScope.baseUrl = 'http://api.dealers-web.com'; // Test
            // $rootScope.homeUrl = "http://www.dealers-web.com"; // Test
            // $rootScope.stripe_publishable_key = 'pk_test_q3cpGyBIL6rsGswSQbP3tMpK'; // Test
            // $rootScope.INTERCOM_APP_ID = "bez9ewf7"; // Test
            $rootScope.baseUrl = 'https://api.dealers-app.com'; // Live
            $rootScope.homeUrl = 'https://www.dealers-app.com'; // Live
            $rootScope.stripe_publishable_key = 'pk_live_mgdZB9xHsOnYaQDXMXJJm4xU'; // Live
            $rootScope.INTERCOM_APP_ID = "z1b3ijln"; // Live
            $rootScope.AWSKey = 'AKIAIWJFJX72FWKD2LYQ';
            $rootScope.AWSSecretKey = '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';
            $rootScope.AWSS3Bucket = 'dealers-app';
            $rootScope.directImageURlPrefix = 'https://' + $rootScope.AWSS3Bucket + '.s3.amazonaws.com/';
            $rootScope.DEFAULT_PRODUCT_PHOTO_URL = "assets/images/icons/@2x/Web_Icons_product_photo_placeholder.png";

            // AWS configuration
            AWS.config.update({
                accessKeyId: $rootScope.AWSKey,
                secretAccessKey: $rootScope.AWSSecretKey
            });
            AWS.config.region = 'eu-west-1';

            // S3 configuration
            $rootScope.s3 = new AWS.S3();

            // Global functions
            $rootScope.setUserProfilePic = setUserProfilePic;

            // Set language
            $rootScope.language = $translate.proposedLanguage();
            var storageKey = 'NG_TRANSLATE_LANG_KEY';

            if (!$translateLocalStorage.get(storageKey)) {
                // There is no translation in the cache. Get the country of the client via the ipinfo.io service and determine the appropriate language.
                console.log("Determining according to country");
                $.getJSON('https://ipinfo.io/json', function (data) {
                    var country = data.country;
                    country = country.toLowerCase();
                    $rootScope.country = country;
                    if (country == 'il') {
                        $rootScope.language = 'he';
                        document.documentElement.setAttribute('dir', 'rtl');// sets "lang" attribute to html
                    }
                    $translate.use($rootScope.language);
                    document.documentElement.setAttribute('lang', $rootScope.language);
                });
            } else {
                if ($rootScope.language == 'he') {
                    document.documentElement.setAttribute('dir', 'rtl');// sets "lang" attribute to html
                    document.documentElement.setAttribute('lang', $rootScope.language);
                }
            }


            /**
             * Initializing the Intercom SDK.
             * @param user - the user.
             */
            function initIntercom(user) {
                var date = new Date(user.register_date).getTime();
                window.Intercom("boot", {
                    app_id: $rootScope.INTERCOM_APP_ID,
                    user_id: user.id,
                    user_hash: user.intercom_code,
                    created_at: date / 1000, // Convert the milliseconds into seconds.
                    name: user.full_name, // Full name
                    email: user.email,
                    date_of_birth: user.date_of_birth,
                    gender: user.gender,
                    location: user.location,
                    role: user.role,
                    rank: user.rank,
                    language: $rootScope.language,
                    plan: "None"
                });
            }

            // keep user logged in after page refresh
            if ($cookies.get('globals') !== '[object Object]') { // checking if there's an object in the cookies key
                $rootScope.globals = $cookies.getObject('globals') || {};
                if ($rootScope.globals.currentUser) {
                    $http.defaults.headers.common['Authorization'] = 'Token ' + $rootScope.globals.currentUser.token;
                    // get the dealer object from the local storage
                    var dealerString = localStorage.getItem('dealer');
                    if (dealerString) {
                        $rootScope.dealer = JSON.parse(dealerString);
                        // RootDealerReady.setAsReady($rootScope.dealer);
                        $rootScope.userProfilePic = "";
                        $rootScope.userProfilePicSender = "user-dealer-pic";
                        setUserProfilePic();
                        initIntercom($rootScope.dealer);
                        $rootScope.$broadcast("DEALER_LOADED");
                    }
                } else {
                    // User is not logged in.
                    window.Intercom("boot", {
                        app_id: $rootScope.INTERCOM_APP_ID
                    });
                }
            }

            /**
             * Checks if the current user has a dealer pic, and if so, downloads it. Otherwise, sets the default user dealer image.
             */
            function setUserProfilePic() {
                var dealer = $rootScope.dealer;
                var photo = $rootScope.dealer.photo;
                if (photo != "None" && photo != "") {
                    DealerPhotos.getPhoto(photo, dealer.id, $rootScope.userProfilePicSender);
                    $rootScope.$on('downloaded-' + $rootScope.userProfilePicSender + '-dealer-pic-' + dealer.id, function (event, args) {
                        if (args.success) {
                            $timeout(function () {
                                $rootScope.userProfilePic = args.data;
                                $rootScope.$apply();
                            }, 1000);
                        } else {
                            $rootScope.userProfilePic = null;
                            console.log(args.message);
                        }
                    });
                } else {
                    $rootScope.userProfilePic = DealerPhotos.DEFAULT_PROFILE_PIC;
                }
            }

            // Roles
            $rootScope.roles = {
                guest: "Guest",
                viewer: "Viewer",
                dealer: "Dealer",
                admin: "Admin"
            };

            // Categories Local Keys (for local client navigation use)
            // The order is important!
            $rootScope.categoriesLocal = [
                "All Categories",
                // "Fashion and Art",
                "Fashion",
                "Accessories",
                "Bags and Purses",
                "Clothing",
                "Shoes",
                "Jewelry",
                "Weddings",
                "Home and Living",
                "Kids and Babies",
                "Vintage",
                "Art",
                "Digital Marketing",

                /* Old Categories */
                // "Automotive",
                // "Health and Beauty",
                // "Books and Magazines",
                // "Electronics",
                // "Entertainment and Events",
                // "Food and Groceries",
                // "Home and Furniture",
                // "Music",
                // "Pets",
                // "Restaurants and Bars",
                // "Services",
                // "Sports and Outdoor",
                // "Travel",
                // "Other"
            ];

            $rootScope.categories = [
                $translate.instant("general.all-categories"),
                // $translate.instant("general.fashion-and-art"),
                $translate.instant("general.fashion"),
                $translate.instant("general.accessories"),
                $translate.instant("general.bags-and-purses"),
                $translate.instant("general.clothing"),
                $translate.instant("general.shoes"),
                $translate.instant("general.jewelry"),
                $translate.instant("general.weddings"),
                $translate.instant("general.home-and-living"),
                $translate.instant("general.kids-and-babies"),
                $translate.instant("general.vintage"),
                $translate.instant("general.art"),
                $translate.instant("general.digital-marketing"),

                /* Old Categories */
                // $translate.instant("general.art"),
                // $translate.instant("general.automotive"),
                // $translate.instant("general.health-beauty"),
                // $translate.instant("general.books-magazines"),
                // $translate.instant("general.electronics"),
                // $translate.instant("general.entertainment-events"),
                // $translate.instant("general.fashion"),
                // $translate.instant("general.food-groceries"),
                // $translate.instant("general.home-furniture"),
                // $translate.instant("general.kids"),
                // $translate.instant("general.music"),
                // $translate.instant("general.pets"),
                // $translate.instant("general.restaurants-bars"),
                // $translate.instant("general.services"),
                // $translate.instant("general.sports-outdoors"),
                // $translate.instant("general.travel"),
                // $translate.instant("general.other")
            ];

            $rootScope.categoriesKeys = {
                // "Faf": $translate.instant("general.fashion-and-art"),
                "Fa": $translate.instant("general.fashion"),
                "Faa": $translate.instant("general.accessories"),
                "Fab": $translate.instant("general.bags-and-purses"),
                "Fac": $translate.instant("general.clothing"),
                "Fas": $translate.instant("general.shoes"),
                "Faj": $translate.instant("general.jewelry"),
                "Faw": $translate.instant("general.weddings"),
                "Fah": $translate.instant("general.home-and-living"),
                "Fak": $translate.instant("general.kids-and-baby"),
                "Fav": $translate.instant("general.vintage"),
                "Ar": $translate.instant("general.art"),
                "Au": $translate.instant("general.automotive"),
                "Be": $translate.instant("general.health-beauty"),
                "Bo": $translate.instant("general.books-magazines"),
                "El": $translate.instant("general.electronics"),
                "En": $translate.instant("general.entertainment-events"),
                "Fo": $translate.instant("general.food-groceries"),
                "Ho": $translate.instant("general.home-furniture"),
                "Ki": $translate.instant("general.kids"),
                "Mu": $translate.instant("general.music"),
                "Pe": $translate.instant("general.pets"),
                "Re": $translate.instant("general.restaurants-bars"),
                "Se": $translate.instant("general.services"),
                "Sp": $translate.instant("general.sports-outdoors"),
                "Tr": $translate.instant("general.travel"),
                "Ot": $translate.instant("general.other")
            };

            $rootScope.categoriesKeysLocal = {
                // "Faf": "Fashion and Art",
                "Fa": "Fashion",
                "Faa": "Accessories",
                "Fab": "Bags and Purses",
                "Fac": "Clothing",
                "Fas": "Shoes",
                "Faj": "Jewelry",
                "Faw": "Weddings",
                "Fah": "Home and Living",
                "Fak": "Kids and Babies",
                "Fav": "Vintage",
                "Ar": "Art",
                "Mdm": "Digital Marketing",
                "Au": "Automotive",
                "Be": "Health and Beauty",
                "Bo": "Books and Magazines",
                "El": "Electronics",
                "En": "Entertainment and Events",
                "Fo": "Food and Groceries",
                "Ho": "Home and Furniture",
                "Ki": "Kids and Babies",
                "Mu": "Music",
                "Pe": "Pets",
                "Re": "Restaurants and Bars",
                "Se": "Services",
                "Sp": "Sports and Outdoor",
                "Tr": "Travel",
                "Ot": "Other"
            };

            $rootScope.$on('$translateChangeSuccess', function () {
                $rootScope.categories = [
                    $translate.instant("general.all-categories"),
                    // $translate.instant("general.fashion-and-art"),
                    $translate.instant("general.fashion"),
                    $translate.instant("general.accessories"),
                    $translate.instant("general.bags-and-purses"),
                    $translate.instant("general.clothing"),
                    $translate.instant("general.shoes"),
                    $translate.instant("general.jewelry"),
                    $translate.instant("general.weddings"),
                    $translate.instant("general.home-and-living"),
                    $translate.instant("general.kids-and-baby"),
                    $translate.instant("general.vintage"),
                    $translate.instant("general.art"),
                    $translate.instant("general.digital-marketing")

                    /* Old Categories */
                    // $translate.instant("general.automotive"),
                    // $translate.instant("general.health-beauty"),
                    // $translate.instant("general.books-magazines"),
                    // $translate.instant("general.electronics"),
                    // $translate.instant("general.entertainment-events"),
                    // $translate.instant("general.food-groceries"),
                    // $translate.instant("general.home-furniture"),
                    // $translate.instant("general.kids"),
                    // $translate.instant("general.music"),
                    // $translate.instant("general.pets"),
                    // $translate.instant("general.restaurants-bars"),
                    // $translate.instant("general.services"),
                    // $translate.instant("general.sports-outdoors"),
                    // $translate.instant("general.travel"),
                    // $translate.instant("general.other")
                ];
                $rootScope.categoriesKeys = {
                    // "Faf": $translate.instant("general.fashion-and-art"),
                    "Fa": $translate.instant("general.fashion"),
                    "Faa": $translate.instant("general.accessories"),
                    "Fab": $translate.instant("general.bags-and-purses"),
                    "Fac": $translate.instant("general.clothing"),
                    "Fas": $translate.instant("general.shoes"),
                    "Faj": $translate.instant("general.jewelry"),
                    "Faw": $translate.instant("general.weddings"),
                    "Fah": $translate.instant("general.home-and-living"),
                    "Fak": $translate.instant("general.kids-and-baby"),
                    "Fav": $translate.instant("general.vintage"),
                    "Ar": $translate.instant("general.art"),
                    "Mdm": $translate.instant("general.digital-marketing")

                    /* Old Categories */
                    // "Au": $translate.instant("general.automotive"),
                    // "Be": $translate.instant("general.health-beauty"),
                    // "Bo": $translate.instant("general.books-magazines"),
                    // "El": $translate.instant("general.electronics"),
                    // "En": $translate.instant("general.entertainment-events"),
                    // "Fo": $translate.instant("general.food-groceries"),
                    // "Ho": $translate.instant("general.home-furniture"),
                    // "Ki": $translate.instant("general.kids"),
                    // "Mu": $translate.instant("general.music"),
                    // "Pe": $translate.instant("general.pets"),
                    // "Re": $translate.instant("general.restaurants-bars"),
                    // "Se": $translate.instant("general.services"),
                    // "Sp": $translate.instant("general.sports-outdoors"),
                    // "Tr": $translate.instant("general.travel"),
                    // "Ot": $translate.instant("general.other")
                };
            });

            $rootScope.evaluateCategoryClass = function (idx, including_all) {
                var subCategories = [
                    $translate.instant("general.accessories"),
                    $translate.instant("general.bags-and-purses"),
                    $translate.instant("general.clothing"),
                    $translate.instant("general.shoes"),
                    $translate.instant("general.jewelry"),
                    $translate.instant("general.weddings"),
                    $translate.instant("general.home-and-living"),
                    $translate.instant("general.kids-and-baby"),
                    $translate.instant("general.vintage")
                ];

                var ap_prerequisite = 0 < idx && idx < 10;
                var reg_prerequisite = 1 < idx && idx < 11;

                if (including_all) {
                    if (reg_prerequisite) {
                        return "sub-category";
                    } else {
                        return "category"
                    }
                } else {
                    if (ap_prerequisite) {
                        return "sub-category";
                    } else {
                        return "category"
                    }
                }
            };

            // Discount types
            $rootScope.discountTypes = {
                percentage: "PE",
                previousPrice: "PP"
            };

            // Marketing materials according to language.
            if ($rootScope.language == 'he') {
                $rootScope.videoLink = "https://youtube.com/embed/7vLFe9Jmkx0";
                $rootScope.facebookPage = "https://www.facebook.com/dealersisrael/"
            } else {
                $rootScope.videoLink = "https://youtube.com/embed/vefVgIRSSN4";
                $rootScope.facebookPage = "https://www.facebook.com/dealersus/";
            }

            $rootScope.showToast = function (text, delay) {
                var timer = 3000; // show the toast for 3 seconds
                if (delay) {
                    timer = delay;
                }
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(text)
                        .position('top')
                        .hideDelay(timer)
                );
            };

            /**
             * Listens to changes in the location service in order to prevent the user from reaching restricted pages,
             * according to his role.
             */
            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                var roles = $rootScope.roles;
                var role, restricted;

                window.Intercom("update");

                if (!$rootScope.dealer) {
                    role = roles.guest;
                } else {
                    role = $rootScope.dealer.role;
                }

                if (role != roles.dealer) {
                    restricted = ['/new-product', '/edit-product'];
                    for (var i = 0; i < restricted.length; i++) {
                        if (next.indexOf(restricted[i]) > -1) {
                            $location.path('/');
                            return;
                        }
                    }
                }

                if (role == roles.dealer) {
                    restricted = ['/register/basic-info'];
                    for (i = 0; i < restricted.length; i++) {
                        if (next.indexOf(restricted[i]) > -1) {
                            $location.path('/');
                            return;
                        }
                    }
                }
            });
        }]);
