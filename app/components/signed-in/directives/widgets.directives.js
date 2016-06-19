(function () {
    'use strict';

    angular.module('DealersApp')

        /**
         * The BUY button.
         */
        .directive('buyButton', ['$rootScope', '$route', 'Product', 'Dialogs', 'ActiveSession',
            function ($rootScope, $route, Product, Dialogs, ActiveSession) {
            return {
                scope: {
                    product: '=',
                    dealerPic: '='
                },
                link: function (scope, element) {

                    var BUY_FUNCTION_REPR = "buyClicked";

                    var product_price = scope.product.price * 100; // In cents
                    var imagePath = $rootScope.directImageURlPrefix + scope.product.dealer.photo;
                    var product_currency;
                    if (scope.product.currency.length == 1) {
                        product_currency = Product.keyForCurrency(scope.product.currency);
                    } else {
                        product_currency = scope.product.currency;
                    }

                    var handler = StripeCheckout.configure({
                        key: 'pk_test_q3cpGyBIL6rsGswSQbP3tMpK',
                        image: imagePath,
                        locale: 'auto',
                        email: $rootScope.dealer.email,
                        token: function (token) {
                            // You can access the token ID with `token.id`.
                            // Get the token ID to your server-side code for use.
                            var charge = {
                                token: token.id,
                                amount: product_price,
                                currency: product_currency,
                                dealer: scope.product.dealer.id,
                                buyer: $rootScope.dealer.id
                            };
                            Product.buyProduct(charge, scope.product, true);
                        }
                    });

                    scope.buyClicked = buyClicked;

                    if (ActiveSession.shouldRunAction(BUY_FUNCTION_REPR)) {
                        scope.buyClicked();
                    }

                    function buyClicked(event) {

                        // First check that the user is signed in
                        if (!$rootScope.dealer) {
                            // The user is not signed in, present the Sign In dialog and quit this function.
                            Dialogs.showSignInDialog(event, 0)
                                .then(function (finished) {
                                    // Reinstantiate the page after adding the buyClicked function to the Actions To Run stack
                                    ActiveSession.addActionToRun(BUY_FUNCTION_REPR);
                                    $route.reload();
                                });
                            return;
                        }

                        handler.open({
                            name: scope.product.title,
                            description: scope.product.dealer.full_name,
                            amount: product_price,
                            currency: product_currency
                        });
                        if (event) {
                            event.preventDefault();
                        }
                    }

                    element.bind('click', scope.buyClicked);
                }
            };
        }])

        /**
         * The LIKE button.
         */
        .directive('likeButton', ['$rootScope', '$http', '$route', 'Product', 'Dialogs', 'ActiveSession',
            function ($rootScope, $http, $route, Product, Dialogs, ActiveSession) {
            return {
                link: function (scope, element) {

                    var LIKE_FUNCTION_REPR = "likeClicked";

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
                            $(element).css('background-color', '#9C27B0').css('color', 'white').find("span").replaceWith("<span> Unlike<span>");
                        } else {
                            $(element).css('background-color', 'white').css('color', '#9C27B0').find("span").replaceWith("<span> Like<span>");
                        }
                    }

                    /**
                     * The user clicked the like button.
                     */
                    function likeClicked(event) {

                        // First check that the user is signed in
                        if (!userID) {
                            // The user is not signed in, present the Sign In dialog and quit this function.
                            Dialogs.showSignInDialog(event, 0)
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
        .directive('shareButton', function () {
                return {
                    link: function (scope, element) {
                        $(element).on("click", function (ev) {
                            var url = "www.dealers-web.com/#" + "/products/" + scope.product.id + "/";
                            FB.ui({
                                method: 'share',
                                mobile_iframe: true,
                                href: url
                            }, function(response){});
                        });
                    }
                };
            })
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
        .directive('scrollDetector', ['Product', function (Product) {
            return {
                link: function (scope, element) {
                    $(window).scroll(function () {
                        if ($(window).scrollTop() + $(window).height() > $(document).height() - 700) {
                            if (!scope.update.loadingMore) {
                                if (scope.update.nextPage) {
                                    console.log("Loading more products");
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
})();
