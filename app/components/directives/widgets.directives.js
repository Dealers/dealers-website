angular.module('DealersApp')

/**
 * The LIKE button.
 */
    .directive('likeButton', ['$rootScope', '$http', '$route', 'Product', 'Dialogs', 'ActiveSession', 'Analytics', '$translate',
        function ($rootScope, $http, $route, Product, Dialogs, ActiveSession, Analytics, $translate) {
            return {
                link: function (scope, element) {

                    var LIKE_FUNCTION_REPR = "likeClicked";
                    setLikeTitle();

                    // First of all check if the scope is defined properly
                    if (!scope.product) {
                        console.log("There's a problem - the parent scope doesn't have a product attribute.");
                        return;
                    }

                    var dealersThatLiked = scope.product.dealattribs.dealers_that_liked;
                    if ($rootScope.dealer) {
                        var userID = $rootScope.dealer.id;
                        updateLikeAppearance();
                    }

                    scope.likeClicked = likeClicked;

                    if (ActiveSession.shouldRunAction(LIKE_FUNCTION_REPR)) {
                        scope.likeClicked();
                    }

                    function isLiked() {
                        /*
                         * Check if the user liked this product, if so, mark the button.
                         */
                        var likedByUser = $.inArray(userID, dealersThatLiked);
                        if (likedByUser == -1) {
                            // The user didn't like the product before, should like it now.
                            return false;
                        }
                        return true;
                    }

                    function updateLikeAppearance() {
                        /*
                         * If the user liked the product, unmark it. If he didn't, mark it.
                         */
                        if (isLiked()) {
                            scope.likeStatus = 'LIKED';
                            scope.likeTitle = $translate.instant('general.liked');
                            $(element).css('color', '#9C27B0').find("span").replaceWith("<span>" + scope.likeTitle + "<span>");
                        } else {
                            scope.likeStatus = 'LIKE';
                            scope.likeTitle = $translate.instant('general.like');
                            $(element).css('color', '#313140').find("span").replaceWith("<span>" + scope.likeTitle + "<span>");
                        }
                    }

                    $rootScope.$on('$translateChangeSuccess', function () {
                        setLikeTitle();
                    });

                    function setLikeTitle() {
                        if (isLiked()) {
                            scope.likeTitle = $translate.instant('general.liked');
                        } else {
                            scope.likeTitle = $translate.instant('general.like');
                        }
                    }

                    /**
                     * The user clicked the like button.
                     */
                    function likeClicked(event) {

                        // First check that the user is signed in
                        if (!userID) {
                            // The user is not signed in, present the Sign In dialog and quit this function.
                            Dialogs.showSignInDialog(event, 0, true)
                                .then(function (finished) {
                                    // Reinstantiate the page after adding the likeClicked function to the Actions To Run stack
                                    ActiveSession.addActionToRun(LIKE_FUNCTION_REPR);
                                    $route.reload();
                                });
                            return;
                        }

                        if (isLiked()) {
                            // Remove the user from the dealersThatLiked array and update the appearance when done.
                            var index = dealersThatLiked.indexOf(userID);
                            if (index > -1) {
                                dealersThatLiked.splice(index, 1);
                            }
                        } else {
                            // Add the user to the dealersThatLiked array and update the appearance when done.
                            Analytics.trackEvent('Product', 'like', String(scope.product.id));
                            dealersThatLiked.push(userID);
                        }
                        $http.patch($rootScope.baseUrl + '/dealattribs/' + scope.product.dealattribs.id + '/', scope.product.dealattribs)
                            .then(function (response) {
                                    // success
                                    scope.product.dealattribs = response.data;
                                    updateLikeAppearance();
                                    // scope.$apply();
                                },
                                function (httpError) {
                                    // error
                                    console.log(httpError.status + " : " + httpError.data);
                                });
                    }
                }
            };
        }])

    /**
     * The FACEBOOK SHARE button.
     */
    .directive('shareButton', ['$rootScope', 'Analytics', function ($rootScope, Analytics) {
        return {
            link: function (scope, element) {
                $(element).on("click", function (ev) {
                    Analytics.trackEvent('Product', 'share', String(scope.product.id));
                    var url = $rootScope.homeUrl + "/products/" + scope.product.id;
                    FB.ui({
                        method: 'share',
                        mobile_iframe: true,
                        href: url
                    }, function (response) {
                    });
                });
            }
        };
    }])

    /**
     * Register As Dealer button.
     */
    .directive('registerAsDealer', ['$rootScope', '$location', '$mdMedia', '$mdDialog',
        function ($rootScope, $location, $mdMedia, $mdDialog) {
            return {
                link: function (scope, element) {
                    scope.customFullscreen = $mdMedia('xs');

                    /**
                     * Presents the sign in dialog (sign up and log in).
                     * @param ev - The event that triggered the function.
                     * @param tabIndex - the index of the selected option (sign up is 0, log in is 1).
                     */
                    scope.showSignInDialog = function (ev, tabIndex) {
                        $mdDialog.show({
                            controller: 'SignInDialogController',
                            templateUrl: 'app/components/views/sign-in/sign-in-dealer-dialog.view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,

                            fullscreen: scope.customFullscreen,
                            locals: {tab: tabIndex, isViewer: false}
                        })
                            .then(function (finished) {
                                // Finished the sign in process
                                if (finished == 0) {
                                    $location.path("/register");
                                } else if (finished == 1) {
                                    $location.path("/home");
                                } else {
                                    console.error("Received something wrong to the callback of showSignInDialog");
                                }
                            });
                    };

                    /**
                     * Takes the user to the register-as-dealer page. If he is not signed in, takes him through the sign in process first.
                     * @param ev - the event that triggered the function.
                     */
                    $(element).on("click", function (ev) {
                        if ($rootScope.dealer) {
                            $location.path("/register");
                            scope.$apply();
                        } else {
                            if ($(element).is("#nav-login")) {
                                scope.showSignInDialog(ev, 1, false);
                            } else {
                                scope.showSignInDialog(ev, 0, true);
                            }
                        }
                    });
                }
            };
        }])
    .directive('loadingSpinner', function () {
        return {
            restrict: 'E',
            scope: {
                size: '@'
            },
            template: "<div class='spinnerContainer'></div>",
            link: function (scope, element) {
                var container = element[0].children[0];
                var scale = 0.25;
                if (scope.size === "small") {
                    scale = 0.16;
                }
                var opts = {
                    lines: 13 // The number of lines to draw
                    , length: 28 // The length of each line
                    , width: 14 // The line thickness
                    , radius: 42 // The radius of the inner circle
                    , scale: scale // Scales overall size of the spinner
                    , corners: 1 // Corner roundness (0..1)
                    , color: 'rgb(100,100,115)' // #rgb or #rrggbb or array of colors
                    , opacity: 0.25 // Opacity of the lines
                    , rotate: 0 // The rotation offset
                    , direction: 1 // 1: clockwise, -1: counterclockwise
                    , speed: 1.2 // Rounds per second
                    , trail: 60 // Afterglow percentage
                    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                    , zIndex: 2e9 // The z-index (defaults to 2000000000)
                    , className: 'spinner' // The CSS class to assign to the spinner
                    , top: '50%' // Top position relative to parent
                    , left: '50%' // Left position relative to parent
                    , shadow: false // Whether to render a shadow
                    , hwaccel: false // Whether to use hardware acceleration
                    , position: 'absolute' // Element positioning
                };
                var spinner = new Spinner(opts).spin(container);
            }
        };
    })
    .directive('ngTranslateLanguageSelect', function (LocalesService) {
        'use strict';
        return {
            restrict: 'A',
            controller: function ($scope) {
                $scope.currentLocaleDisplayName = LocalesService.getLocaleDisplayName();
                $scope.localesDisplayNames = LocalesService.getLocalesDisplayNames();
                $scope.visible = $scope.localesDisplayNames && $scope.localesDisplayNames.length > 1;
                $scope.changeLanguage = function (locale) {
                    LocalesService.setLocaleByDisplayName(locale);
                };
                $scope.getFlag = function (locale) {
                    return LocalesService.getFlag(locale);
                };
            }
        }
    })
    .directive('scrollDetector', ['Product', function (Product) {
        return {
            link: function (scope, element) {
                $(window).scroll(function () {
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 700) {
                        if (!scope.update.loadingMore) {
                            if (scope.update.nextPage) {
                                scope.update.loadingMore = true;
                                scope.$apply();
                                scope.getProducts(scope.update.nextPage);
                            }
                        }
                    }
                });
                scope.$on('$destroy', function () {
                    $(window).off("scroll");
                });
            }
        };
    }]);