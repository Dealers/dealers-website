/**
 * Created by gullumbroso on 09/07/2016.
 */


(function () {
    'use strict';

    angular.module('DealersApp')
    /**
     * The controller that is responsible for checkout's view behaviour.
     * @param $scope - the isolated scope of the controller.
     * @param $mdDialog - the mdDialog service of the Material Angular library.
     */
        .controller('PurchaseDetailsController', ['$scope', '$rootScope', '$routeParams', '$location', '$mdDialog', '$mdMedia', 'ActiveSession', 'Purchase', 'Product', 'Dealer',
            function ($scope, $rootScope, $routeParams, $location, $mdDialog, $mdMedia, ActiveSession, Purchase, Product, Dealer) {

                var DOWNLOADED_STATUS = "downloaded";
                var DOWNLOADING_STATUS = "downloading";
                var FAILED_STATUS = "failed";
                var ACTIVE_SESSION_PURCHASE_KEY = "PURCHASE";

                initializeView();

                function initializeView() {
                    $scope.status = DOWNLOADING_STATUS;
                    $scope.screenIsSmall = $mdMedia('xs');
                    $scope.purchase = ActiveSession.getTempData(ACTIVE_SESSION_PURCHASE_KEY); // Retrieves the product from the Active Session service.
                    $scope.isDealer = false; // Whether the user is the dealer of this purchase or not.
                    if (!$scope.purchase) {
                        // There is no purchase in the session, download it form the server.
                        downloadPurchase();
                    } else {
                        $scope.status = DOWNLOADED_STATUS;
                        setPurchaseDetails();
                    }
                }

                function downloadPurchase() {
                    var purchaseID = $routeParams.purchaseID;
                    Purchase.getPurchase(purchaseID)
                        .then(function (result) {
                            $scope.status = DOWNLOADED_STATUS;
                            $scope.purchase = result.data;
                            setPurchaseDetails();
                        }, function (httpError) {
                            $scope.status = FAILED_STATUS;
                            $scope.errorMessage = "Couldn't download the purchase object.";
                            $scope.errorPrompt = "Please try again...";
                        });
                }

                function setPurchaseDetails() {
                    $scope.shipping_address = $scope.purchase.shipping_address;
                    if (!$scope.purchase.buyer.id) {
                        // purchase.buyer contains the id of the buyer. Need to download his name and photo.
                        Dealer.getShortDealer($scope.purchase.buyer)
                            .then(function (result) {
                                $scope.purchase.buyer = result.data;
                            }, function (httpError) {
                                console.log("Couldn't download the buyer's name and photo.");
                            })
                    }
                    var dealerID = $scope.purchase.dealer.id ? $scope.purchase.dealer.id : $scope.purchase.dealer;
                    $scope.isDealer = dealerID == $rootScope.dealer.id;
                    var key = $scope.purchase.currency;
                    $scope.purchase.currency = Product.currencyForKey(key);
                    if ($scope.purchase.deal.id) {
                        downloadProduct($scope.purchase.deal.id);
                    } else {
                        downloadProduct($scope.purchase.deal);
                    }
                }

                function downloadProduct(productID) {
                    Product.getProduct(productID)
                        .then(function (result) {
                            $scope.product = result.data;
                            $scope.product = Product.mapData($scope.product);
                        }, function (httpError) {
                            $scope.status = FAILED_STATUS;
                            $scope.errorMessage = "Couldn't download the product";
                            $scope.errorPrompt = "Please try again...";
                        });
                }

                /**
                 * Set the title of the mark button according to the status of the purchase object.
                 * @param purchase - the purchase object.
                 * @returns {string} the title of the button.
                 */
                $scope.markButtonTitle = function (purchase) {
                    if (!purchase) return "";
                    if ($scope.isDealer) {
                        if (purchase.status == Purchase.SENT_STATUS) {
                            return "Marked as sent";
                        } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                            return "Received!"
                        } else {
                            return "Mark as sent";
                        }
                    } else {
                        if (purchase.status == Purchase.RECEIVED_STATUS) {
                            return "Marked as received";
                        } else {
                            return "Mark as received";
                        }
                    }
                };

                $scope.$on('$destroy', function () {
                    ActiveSession.removeTempData(ACTIVE_SESSION_PURCHASE_KEY);
                });

            }]);
})();