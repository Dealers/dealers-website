/**
 * Created by gullumbroso on 18/06/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
        .directive('updateStatusBuyer', ['$mdDialog', 'Purchase', 'Dialogs', 'Product', function ($mdDialog, Purchase, Dialogs, Product) {
            return {
                link: function (scope) {

                    /**
                     * Changes the status of the purchase (toggles between "Received" and "Sent").
                     *
                     * @param event - the event that triggered the function.
                     * @param purchase - the purchase object.
                     */
                    scope.changeStatus = function (event, purchase) {
                        var dialog;
                        if (purchase.status == Purchase.SENT_STATUS || purchase.status == Purchase.PURCHASED_STATUS) {
                            dialog = Dialogs.confirmDialog("Mark this order as 'Received'", "Did you receive this product?", "Yes", event);
                            $mdDialog.show(dialog).then(function () {
                                updatePurchase(Purchase.RECEIVED_STATUS, purchase);
                            });
                        } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                            dialog = Dialogs.confirmDialog("Mark this order as 'Sent' again", "Didn't you receive this product?", "No, I didn't", event);
                            $mdDialog.show(dialog).then(function () {
                                updatePurchase(Purchase.SENT_STATUS, purchase);
                            });
                        }
                    };

                    /**
                     * Updates the status of the purchase via the Purchase service.
                     * @param status - the new status to update.
                     * @param purchase - the purchase object.
                     */
                    function updatePurchase(status, purchase) {
                        var originalPurchase = $.extend(true, {}, purchase);
                        Purchase.updatePurchase(status, purchase)
                            .then(function (response) {
                                // success
                                scope.purchase = response.data;
                                organizePurchaseData(originalPurchase);
                            }, function (err) {
                                // failure
                                console.log("Couldn't update the status of the purchase :(");
                            });
                    }

                    /**
                     * Organizes the data of the purchase object before presentation.
                     * @param originalPurchase - the purchase object before the update. (Sometimes includes information
                     *      that gets lost in the patch request)
                     */
                    function organizePurchaseData(originalPurchase) {
                        scope.purchase.currency = Product.currencyForKey(scope.purchase.currency);
                        if (originalPurchase.deal.id) {
                            scope.purchase.deal = originalPurchase.deal;
                        }
                        if (originalPurchase.buyer.id) {
                            scope.purchase.buyer = originalPurchase.buyer;
                        }
                        if (originalPurchase.dealer.id) {
                            scope.purchase.dealer = originalPurchase.dealer;
                        }
                    }
                }
            };
        }])

        .directive('updateStatusDealer', ['$mdDialog', 'Purchase', 'Dialogs', 'Product', function ($mdDialog, Purchase, Dialogs, Product) {
            return {
                link: function (scope) {

                    /**
                     * Changes the status of the purchase (toggles between "Received" and "Sent").
                     *
                     * @param event - the event that triggered the function.
                     * @param purchase - the purchase object.
                     */
                    scope.changeStatus = function (event, purchase) {
                        var dialog;
                        if (purchase.status == Purchase.PURCHASED_STATUS) {
                            dialog = promptDialog("Mark this order as 'Sent'",
                                "What is the estimated delivery time (days)?",
                                "e.g. 30",
                                "OK",
                                event);
                            $mdDialog.show(dialog).then(function (result) {
                                if (result) {
                                    if (result.length > 0) {
                                        var numOfDays = parseInt(result, 10);
                                        if (numOfDays > 0) {
                                            purchase.estimated_delivery_time = numOfDays;
                                            updatePurchase(Purchase.SENT_STATUS, purchase);
                                            return;
                                        }
                                    }
                                }
                                showAlertDialog(event);
                            });
                        } else if (purchase.status == Purchase.SENT_STATUS) {
                            dialog = Dialogs.confirmDialog("Mark this order as 'Purchased' again", "Didn't you send this product?", "No, I didn't", event);
                            $mdDialog.show(dialog).then(function () {
                                updatePurchase(Purchase.PURCHASED_STATUS, purchase);
                            });
                        }
                    };

                    /**
                     * Presented when the dealer didn't specified an estimated delivery time.
                     */
                    function showAlertDialog(ev) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title("You didn't specified a valid estimated delivery time.")
                                .textContent("This is required so the customer will know how long to wait for his order.")
                                .ariaLabel('Alert Dialog')
                                .ok("Got it")
                                .targetEvent(ev)
                        );
                    }

                    /**
                     * Presents the prompt dialog when there is an invalid field.
                     *
                     * @param title - the title of the alert dialog.
                     * @param content - the content of the alert dialog.
                     * @param placeholder - the placeholder of the input.
                     * @param confirm - the confirm button title.
                     * @param ev - the event that triggered the alert.
                     */
                    function promptDialog(title, content, placeholder, confirm, ev) {
                        return $mdDialog.prompt()
                            .title(title)
                            .textContent(content)
                            .placeholder(placeholder)
                            .ariaLabel('Estimated Delivery Time')
                            .targetEvent(ev)
                            .ok(confirm)
                            .cancel('Cancel');
                    }

                    /**
                     * Updates the status of the purchase via the Purchase service.
                     * @param status - the new status to update.
                     * @param purchase - the purchase object.
                     */
                    function updatePurchase(status, purchase) {
                        var originalPurchase = $.extend(true, {}, purchase);
                        Purchase.updatePurchase(status, purchase)
                            .then(function (response) {
                                // success
                                scope.purchase = response.data;
                                organizePurchaseData(originalPurchase);
                            }, function (err) {
                                // failure
                                console.log("Couldn't update the status of the purchase :(");
                            });
                    }

                    /**
                     * Organizes the data of the purchase object before presentation.
                     * @param originalPurchase - the purchase object before the update. (Sometimes includes information
                     *      that gets lost in the patch request)
                     */
                    function organizePurchaseData(originalPurchase) {
                        scope.purchase.currency = Product.currencyForKey(scope.purchase.currency);
                        if (originalPurchase.deal.id) {
                            scope.purchase.deal = originalPurchase.deal;
                        }
                        if (originalPurchase.buyer.id) {
                            scope.purchase.buyer = originalPurchase.buyer;
                        }
                        if (originalPurchase.dealer.id) {
                            scope.purchase.dealer = originalPurchase.dealer;
                        }
                    }
                }
            }
        }])

        .directive('ordersList', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {},
                templateUrl: 'app/components/signed-in/views/purchases/orders-list.view.html',
                controller: function ($scope, $rootScope, $location, $mdDialog, ActiveSession, Purchase, Product) {

                    var LOADING_STATUS = "loading";
                    var DOWNLOADED_STATUS = "downloaded";

                    $scope.loadingStatus = LOADING_STATUS;
                    downloadOrders();

                    /**
                     * Downloads the orders of this user.
                     */
                    function downloadOrders() {
                        Purchase.getOrders($rootScope.dealer.id)
                            .then(function (result) {
                                // success
                                $scope.purchases = result.data.buyer_purchases;
                                $scope.purchases = Product.convertKeysToCurrencies($scope.purchases);
                                $scope.loadingStatus = DOWNLOADED_STATUS;
                            }, function (err) {
                                // failure
                                console.log("Couldn't download the orders of this user :(");
                            })
                    }

                    /**
                     * Set the title of the mark button according to the status of the purchase object.
                     * @param purchase - the purchase object.
                     * @returns {string} the title of the button.
                     */
                    $scope.markButtonTitle = function (purchase) {
                        if (purchase.status == Purchase.RECEIVED_STATUS) {
                            return "Marked as received";
                        } else {
                            return "Mark as received";
                        }
                    };

                    /**
                     * Takes the user to the purchase details page.
                     *
                     * @param purchase - the purchase.
                     * @param $event - the event that triggered the function.
                     */
                    $scope.purchaseDetails = function (purchase, $event) {
                        ActiveSession.setTempData("PURCHASE", purchase);
                        $location.path("/purchase/" + purchase.id);
                    };
                }
            }
        })

        .directive('salesList', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {},
                templateUrl: 'app/components/signed-in/views/purchases/sales-list.view.html',
                controller: function ($scope, $rootScope, $location, $mdDialog, ActiveSession, Purchase, Product) {

                    var LOADING_STATUS = "loading";
                    var DOWNLOADED_STATUS = "downloaded";

                    $scope.loadingStatus = LOADING_STATUS;
                    downloadSales();

                    /**
                     * Downloads the sales of this user.
                     */
                    function downloadSales() {
                        Purchase.getSales($rootScope.dealer.id)
                            .then(function (result) {
                                // success
                                $scope.purchases = result.data.dealer_purchases;
                                $scope.purchases = Product.convertKeysToCurrencies($scope.purchases);
                                $scope.loadingStatus = DOWNLOADED_STATUS;
                            }, function (err) {
                                // failure
                                console.log("Couldn't download the orders of this user :(");
                                $scope.loadingStatus = DOWNLOADED_STATUS;
                            })
                    }

                    /**
                     * Set the title of the mark button according to the status of the purchase object.
                     * @param purchase - the purchase object.
                     * @returns {string} the title of the button.
                     */
                    $scope.markButtonTitle = function (purchase) {
                        if (purchase.status == Purchase.SENT_STATUS) {
                            return "Marked as sent";
                        } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                            return "Received!"
                        } else {
                            return "Mark as sent";
                        }
                    };

                    /**
                     * Takes the user to the purchase details page.
                     *
                     * @param purchase - the purchase.
                     * @param $event - the event that triggered the function.
                     */
                    $scope.purchaseDetails = function (purchase, $event) {
                        ActiveSession.setTempData("PURCHASE", purchase);
                        $location.path("/purchase/" + purchase.id);
                    };
                }
            }
        });
})();
