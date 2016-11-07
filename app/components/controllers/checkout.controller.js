/**
 * Created by gullumbroso on 22/04/2016.
 */

angular.module('DealersApp')
/**
 * The controller that is responsible for checkout's view behaviour.
 * @param $scope - the isolated scope of the controller.
 * @param $mdDialog - the mdDialog service of the Material Angular library.
 */
    .controller('CheckoutController', ['$scope', '$rootScope', '$routeParams', '$location', '$mdMedia', '$mdDialog', 'Checkout', 'ActiveSession', 'Product', 'ProductPhotos', 'Purchase', 'Dialogs', 'ShippingMethods', 'Translations',
        function ($scope, $rootScope, $routeParams, $location, $mdMedia, $mdDialog, Checkout, ActiveSession, Product, ProductPhotos, Purchase, Dialogs, ShippingMethods, Translations) {

            // First check if there's a product object in the ActiveSession service. If not, download it.
            // Then create the purchase object.

            var DEFAULT_PHOTO_RATIO = 0.678125;
            var DOWNLOADED_STATUS = "downloaded";
            var DOWNLOADING_STATUS = "downloading";
            var FAILED_STATUS = "failed";

            $scope.status = DOWNLOADING_STATUS;
            $scope.finished = false;
            var shippingAddress = $rootScope.dealer.shipping_address;
            $scope.shipping_address = shippingAddress ? shippingAddress : {};
            $scope.shippingMethods = [];
            $scope.PICKUP_METHOD = ShippingMethods.PICKUP_METHOD;
            $scope.delivery = {
                selectedShipping: "",
                selectedShippingObj: {}
            };
            $scope.presentShippingAddress = false;

            $scope.$watch("delivery.selectedShipping", function() {
                $scope.presentShippingAddress = $scope.delivery.selectedShipping == ShippingMethods.DEALERS_METHOD ||
                    $scope.delivery.selectedShipping == ShippingMethods.CUSTOM_METHOD;
            });

            initializeView();

            function initializeView() {
                $scope.product = ActiveSession.getTempData("PRODUCT"); // Retrieves the product from the Active Session service.
                $scope.$watch(function () {
                    return $mdMedia('gt-sm');
                }, function (isSmallSize) {
                    $scope.smallSize = !isSmallSize;
                });
                if (!$scope.product) {
                    // There is no product in the session, download it form the server.
                    downloadProduct();
                } else {
                    $scope.status = DOWNLOADED_STATUS;
                    prepareView();
                }
            }

            function downloadProduct() {
                var productID = $routeParams.productID;
                Product.getProduct(productID)
                    .then(function (result) {
                        $scope.status = DOWNLOADED_STATUS;
                        $scope.product = result.data;
                        $scope.product = Product.mapData($scope.product);
                        if (!($scope.product.max_quantity > 0)) $scope.product.max_quantity = 30;
                        prepareView();
                    }, function (httpError) {
                        $scope.status = FAILED_STATUS;
                        $scope.errorMessage = "Couldn't download the product";
                        $scope.errorPrompt = "Please try again...";
                    });
            }

            function prepareView() {
                createPurchaseObject();
                setProductPic();
                organizeShipping();
            }

            function createPurchaseObject() {
                var purchase = Checkout.purchase;
                if (!purchase || $.isEmptyObject(purchase)) {
                    purchase = Checkout.retrieveSavedSession();
                    if (!purchase || $.isEmptyObject(purchase)) {
                        console.log("No purchase object!");
                        $location.path("/products/" + $scope.product.id);
                    }
                }

                $scope.purchase = {
                    buyer: $rootScope.dealer.id,
                    dealer: $scope.product.dealer.id,
                    deal: $scope.product.id,
                    amount: $scope.product.price * 100, // Convert to cents
                    currency: $scope.product.currency,
                    status: "Purchased",
                    quantity: purchase.quantity,
                    selections: purchase.selections
                }
            }

            function setProductPic() {

                if ($scope.product.photo) {
                    $scope.productImage = $scope.product.photo;
                    $scope.productImageStatus = DOWNLOADED_STATUS;

                } else {
                    ProductPhotos.downloadPhoto($scope.product.photo1, $scope.product.id);
                    $scope.productImageStatus = DOWNLOADING_STATUS;

                    $scope.$on('downloaded-photo-' + $scope.product.id, function (event, args) {
                        if (args.success) {
                            $scope.productImage = args.data.url;
                            $scope.product.photo = $scope.productImage;
                            $scope.productImageStatus = DOWNLOADED_STATUS;
                            $scope.$apply();
                        } else {
                            console.log(args.data.message);
                        }
                    });
                }
            }

            /**
             * Presents the description of the shipping method.
             * @param shippingMethod - The shipping method.
             * @param event - The event that triggered the function.
             */
            $scope.presentDetails = function (shippingMethod, event) {
                Dialogs.showAlertDialog(shippingMethod.title, shippingMethod.description, event);
            };

            /**
             * Updates the selcted shipping method in the purchase object each time there is a change event in the radio group.
             * @param event - The event that triggered the function.
             */
            $scope.updateSelectedShipping = function (event) {
                var selected = $scope.delivery.selectedShipping;
                if (selected == ShippingMethods.DEALERS_METHOD) {
                    $scope.delivery.selectedShippingObj = $scope.product.dealers_delivery;
                } else if (selected == ShippingMethods.CUSTOM_METHOD) {
                    $scope.delivery.selectedShippingObj = $scope.product.custom_delivery;
                } else if (selected == ShippingMethods.PICKUP_METHOD) {
                    $scope.delivery.selectedShippingObj = $scope.product.pickup_delivery;
                }
            };

            function organizeShipping() {
                var shippingMethods = [];
                if ($scope.product.dealers_delivery) {
                    $scope.product.dealers_delivery.title = ShippingMethods.DEALERS_SHIPPING_TITLE;
                    $scope.product.dealers_delivery.description = ShippingMethods.DEALERS_SHIPPING_DESCRIPTION;
                    shippingMethods.push($scope.product.dealers_delivery);
                }
                if ($scope.product.custom_delivery) {
                    shippingMethods.push($scope.product.custom_delivery);
                }
                if ($scope.product.pickup_delivery) {
                    $scope.product.pickup_delivery.title = ShippingMethods.PICKUP_TITLE;
                    shippingMethods.push($scope.product.pickup_delivery);
                }

                if (shippingMethods.length == 1) {
                    $scope.delivery.selectedShipping = shippingMethods[0].delivery_method;
                    $scope.delivery.selectedShippingObj = shippingMethods[0];
                }
                $scope.shippingMethods = shippingMethods;
            }

            $scope.checkout = function (form, ev) {

                if (!$scope.purchase.quantity) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title(Translations.checkout.invalidQuantityTitle)
                            .textContent(Translations.checkout.invalidQuantityContent + $scope.product.max_quantity + ".")
                            .ariaLabel('Alert Dialog')
                            .ok(Translations.general.gotIt)
                            .targetEvent(ev)
                    );
                    return;
                }
                if (!$scope.delivery.selectedShipping) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title(Translations.checkout.blankDelivery)
                            .textContent("")
                            .ariaLabel('Alert Dialog')
                            .ok(Translations.general.gotIt)
                            .targetEvent(ev)
                    );
                    return;
                }
                if ($scope.presentShippingAddress) {
                    if (!form.$valid) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title(Translations.checkout.invalidShippingAddressTitle)
                                .textContent(Translations.checkout.invalidShippingAddressContent)
                                .ariaLabel('Alert Dialog')
                                .ok(Translations.general.gotIt)
                                .targetEvent(ev)
                        );
                        return;
                    }
                }

                var shipping_price = $scope.delivery.selectedShippingObj.shipping_price * 100; // In cents
                var priceBeforeShipping = $scope.product.price * $scope.purchase.quantity * 100; // In cents
                var totalPrice = priceBeforeShipping + shipping_price;
                var imagePath = $rootScope.directImageURlPrefix + $scope.product.dealer.photo;
                var product_currency;

                if ($scope.product.currency.length == 1) {
                    product_currency = Product.keyForCurrency($scope.product.currency);
                } else {
                    product_currency = $scope.product.currency;
                }



                $scope.purchase.shipping_address = $scope.shipping_address;
                $scope.purchase.delivery = $scope.delivery.selectedShippingObj.id;
                var purchaseObj = $.extend(true, {}, $scope.purchase);
                purchaseObj.currency = product_currency;

                var handler = StripeCheckout.configure({
                    key: $rootScope.stripe_publishable_key,
                    image: imagePath,
                    locale: 'auto',
                    email: $rootScope.dealer.email,
                    token: function (token) {
                        // You can access the token ID with `token.id`.
                        // Get the token ID to your server-side code for use.
                        var charge = {
                            token: token.id,
                            amount: totalPrice,
                            currency: product_currency,
                            dealer: $scope.product.dealer.id,
                            buyer: $rootScope.dealer.id
                        };
                        Product.buyProduct(charge)
                            .then(function (response) {
                                    // success
                                    console.log("Payment successful!");
                                    $scope.finished = true;
                                    Purchase.addPurchase(purchaseObj, $scope.product);
                                    ActiveSession.setTempData("PRODUCT", $scope.product);
                                    Intercom('trackEvent', 'purchased', {
                                        product_id: $scope.product.id,
                                        product_title: $scope.product.title,
                                        quantity: purchaseObj.quantity,
                                        total_price: totalPrice,
                                        currency: product_currency
                                    });
                                    $location.path("/products/" + $scope.product.id + "/checkout-finish");
                                },
                                function (httpError) {
                                    // error
                                    console.log("Error!\n" + httpError);
                                });
                    }
                });

                handler.open({
                    name: $scope.product.title,
                    description: $scope.product.dealer.full_name,
                    amount: totalPrice,
                    currency: product_currency
                });
                if (event) {
                    event.preventDefault();
                }

                /*
                 Dealer.updateShippingAddress($scope.shipping_address)
                 .then(function (result) {

                 }, function (httpError) {

                 });
                 */
            };

            window.onbeforeunload = function () {
                Checkout.saveSession($scope.purchase);
            };

            var $locationChangeStartUnbind = $scope.$on('$locationChangeStart', function () {
                if ($scope.finished) {
                    Checkout.clearSession();
                } else {
                    Checkout.saveSession($scope.purchase);
                }
            });

            $scope.$on('$destroy', function () {
                Checkout.clearSession();
            })

        }]);