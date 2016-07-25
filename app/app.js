(function () {
    'use strict';

    angular.module('DealersApp', ['ngAnimate', 'ngRoute', 'ngCookies', 'ngMaterial', 'ui.bootstrap', 'ngImgCrop'])

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('purple', {
                    'default': '500'
                })
                .accentPalette('purple', {
                    'default': '500'
                })
        })
        .run(['$rootScope', '$location', '$cookies', '$http', '$mdToast', 'DealerPhotos',
            function ($rootScope, $location, $cookies, $http, $mdToast, DealerPhotos) {

                // global constants
                $rootScope.baseUrl = 'http://api.dealers-web.com';
                $rootScope.homeUrl = 'http://www.dealers-web.com';
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

                /**
                 * Initializing the Intercom SDK.
                 * @param user - the user.
                 */
                function initIntercom(user) {
                    $rootScope.INTERCOM_APP_ID = "z1b3ijln";
                    window.Intercom("boot", {
                        app_id: $rootScope.INTERCOM_APP_ID,
                        user_id: user.id,
                        user_hash: user.intercom_code,
                        name: user.full_name, // Full name
                        email: user.email,
                        date_of_birth: user.date_of_birth,
                        gender: user.gender,
                        about: user.about,
                        location: user.location,
                        role: user.role,
                        rank: user.rank
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
                            $rootScope.userProfilePic = "";
                            $rootScope.userProfilePicSender = "user-profile-pic";
                            setUserProfilePic();
                            initIntercom($rootScope.dealer);
                        }
                    }
                }

                /**
                 * Checks if the current user has a profile pic, and if so, downloads it. Otherwise, sets the default user profile image.
                 */
                 function setUserProfilePic() {
                    var dealer = $rootScope.dealer;
                    var photo = $rootScope.dealer.photo;
                    if (photo != "None" && photo != "") {
                        DealerPhotos.getPhoto(photo, dealer.id, $rootScope.userProfilePicSender);
                        $rootScope.$on('downloaded-' + $rootScope.userProfilePicSender + '-profile-pic-' + dealer.id, function (event, args) {
                            if (args.success) {
                                $rootScope.userProfilePic = args.data;
                                $rootScope.$apply();
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

                // Categories
                $rootScope.categories = [
                    "Art",
                    "Automotive",
                    "Beauty & Personal Care",
                    "Books & Magazines",
                    "Electronics",
                    "Entertainment & Events",
                    "Fashion",
                    "Food & Groceries",
                    "Home & Forniture",
                    "Kids & Babies",
                    "Music",
                    "Pets",
                    "Restaurants & Bars",
                    "Sports & Outdoor",
                    "Travel",
                    "Other"
                ];

                // Discount types
                $rootScope.discountTypes = {
                    percentage: "PE",
                    previousPrice: "PP"
                };

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
                        restricted = ['/register'];
                        for (i = 0; i < restricted.length; i++) {
                            if (next.indexOf(restricted[i]) > -1) {
                                $location.path('/home');
                                return;
                            }
                        }
                    }
                });
            }]);
})();
