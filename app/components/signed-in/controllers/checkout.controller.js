/**
 * Created by gullumbroso on 02/07/2016.
 */

/**
 * Created by gullumbroso on 22/04/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
    /**
     * The controller that is responsible for checkout's view behaviour.
     * @param $scope - the isolated scope of the controller.
     * @param $mdDialog - the mdDialog service of the Material Angular library.
     */
        .controller('CheckoutController', ['$scope', '$rootScope', '$routeParams', '$location', '$mdDialog', 'ActiveSession', 'Product', 'ProductPhotos', 'Purchase',
            function ($scope, $rootScope, $routeParams, $location, $mdDialog, ActiveSession, Product, ProductPhotos, Purchase) {

                // First check if there's a product object in the ActiveSession service. If not, download it.
                // Then create the purchase object.

                var DEFAULT_PHOTO_RATIO = 0.678125;
                var DOWNLOADED_STATUS = "downloaded";
                var DOWNLOADING_STATUS = "downloading";
                var FAILED_STATUS = "failed";

                $scope.status = DOWNLOADING_STATUS;
                var shippingAddress = $rootScope.dealer.shipping_address;
                $scope.shipping_address = shippingAddress ? shippingAddress : {};

                initializeView();

                function initializeView() {
                    $scope.product = ActiveSession.getTempData("PRODUCT"); // Retrieves the product from the Active Session service.
                    if (!$scope.product) {
                        // There is no product in the session, download it form the server.
                        downloadProduct();
                    } else {
                        $scope.status = DOWNLOADED_STATUS;
                        createPurchaseObject();
                        setProductPic();
                    }
                }

                function downloadProduct() {
                    var productID = $routeParams.productID;
                    Product.getProduct(productID)
                        .then(function (result) {
                            $scope.status = DOWNLOADED_STATUS;
                            $scope.product = result.data;
                            $scope.product = Product.mapData($scope.product);
                            createPurchaseObject();
                            setProductPic();
                        }, function (httpError) {
                            $scope.status = FAILED_STATUS;
                            $scope.errorMessage = "Couldn't download the product";
                            $scope.errorPrompt = "Please try again...";
                        });
                }

                function createPurchaseObject() {
                    $scope.purchase = {
                        buyer: $rootScope.dealer.id,
                        dealer: $scope.product.dealer.id,
                        deal: $scope.product.id,
                        amount: $scope.product.price * 100, // Convert to cents
                        currency: $scope.product.currency,
                        status: "Purchased",
                        quantity: 1
                    }
                }

                function setProductPic() {

                    /*
                     var ratio = DEFAULT_PHOTO_RATIO;
                     var width = product.main_photo_width;
                     var height = product.main_photo_height;
                     $scope.greaterHeight = height > width;
                     if (width && height) {
                     ratio = product.main_photo_height / product.main_photo_width;
                     }

                     var currentWidth = element.width();
                     var imageHeight = ratio * currentWidth;
                     var heightString = String(imageHeight) + "px";
                     imageContainer.css("height", heightString);

                     */

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

                $scope.checkout = function (form, ev) {

                    if (!form.$valid) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title("Invalid Shipping Address")
                                .textContent("Please fill correctly all your shipping address information.")
                                .ariaLabel('Alert Dialog')
                                .ok("Got it")
                                .targetEvent(ev)
                        );
                        return;
                    }

                    var total_price = $scope.product.price * $scope.purchase.quantity * 100; // In cents
                    var imagePath = $rootScope.directImageURlPrefix + $scope.product.dealer.photo;
                    var product_currency;

                    if ($scope.product.currency.length == 1) {
                        product_currency = Product.keyForCurrency($scope.product.currency);
                    } else {
                        product_currency = $scope.product.currency;
                    }

                    $scope.purchase.shipping_address = $scope.shipping_address;
                    $scope.purchase.currency = product_currency;

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
                                amount: total_price,
                                currency: product_currency,
                                dealer: $scope.product.dealer.id,
                                buyer: $rootScope.dealer.id
                            };
                            Product.buyProduct(charge)
                                .then(function (response) {
                                        // success
                                        console.log("Payment successful!");
                                        Purchase.addPurchase($scope.purchase);
                                        ActiveSession.setTempData("PRODUCT", $scope.product);
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
                        amount: total_price,
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
                }

            }]);
})();