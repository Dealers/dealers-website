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
        .controller('PurchaseDetailsController', ['$scope', '$rootScope', '$routeParams', '$location', '$mdDialog', '$mdMedia', 'ActiveSession', 'Purchase', 'Product',
            function ($scope, $rootScope, $routeParams, $location, $mdDialog, $mdMedia, ActiveSession, Purchase, Product) {

                var DOWNLOADED_STATUS = "downloaded";
                var DOWNLOADING_STATUS = "downloading";
                var FAILED_STATUS = "failed";
                var ACTIVE_SESSION_PURCHASE_KEY = "PURCHASE";

                initializeView();

                function initializeView() {
                    $scope.status = DOWNLOADING_STATUS;
                    $scope.screenIsSmall = $mdMedia('xs');
                    $scope.purchase = ActiveSession.getTempData(ACTIVE_SESSION_PURCHASE_KEY); // Retrieves the product from the Active Session service.
                    if (!$scope.purchase) {
                        // There is no purchase in the session, download it form the server.
                        downloadPurchase();
                    } else {
                        $scope.status = DOWNLOADED_STATUS;
                        $scope.shipping_address = $scope.purchase.shipping_address;
                        setPurchaseDetails();
                    }
                }

                function downloadPurchase() {
                    var purchaseID = $routeParams.purchaseID;
                    Purchase.getPurchase(purchaseID)
                        .then(function (result) {
                            $scope.status = DOWNLOADED_STATUS;
                            $scope.purchase = result.data;
                            $scope.shipping_address = $scope.purchase.shipping_address;
                            setPurchaseDetails();
                        }, function (httpError) {
                            $scope.status = FAILED_STATUS;
                            $scope.errorMessage = "Couldn't download the purchase object.";
                            $scope.errorPrompt = "Please try again...";
                        });
                }

                function setPurchaseDetails() {
                    var key = $scope.purchase.currency;
                    $scope.purchase.currency = Product.currencyForKey(key);
                    downloadProduct($scope.purchase.deal);
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
                    if ($scope.purchase) {
                        if ($scope.purchase.dealer == $rootScope.dealer.id) {
                            if (purchase.status == Purchase.SENT_STATUS) {
                                return "Marked as sent";
                            } else {
                                return "Mark as sent";
                            }
                        }
                        else {
                            if (purchase.status == Purchase.RECEIVED_STATUS) {
                                return "Marked as received";
                            } else {
                                return "Mark as received";
                            }
                        }
                    }
                };

                $scope.$on('$destroy', function () {
                    ActiveSession.removeTempData(ACTIVE_SESSION_PURCHASE_KEY);
                });

            }]);
})();