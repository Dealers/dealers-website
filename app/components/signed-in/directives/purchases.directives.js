/**
 * Created by gullumbroso on 18/06/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
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
                     * Changes the status of the purchase (toggles between "Received" and "Sent").
                     *
                     * @param event - the event that triggered the function.
                     * @param purchase - the purchase object.
                     */
                    $scope.changeStatus = function (event, purchase) {
                        var dialog;
                        if (purchase.status == Purchase.SENT_STATUS || purchase.status == Purchase.PURCHASED_STATUS) {
                            dialog = confirmDialog("Mark this order as 'Received'", "Did you receive this product?", "Yes", event);
                            $mdDialog.show(dialog).then(function () {
                                updateStatus(Purchase.RECEIVED_STATUS, purchase);
                            });
                        } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                            dialog = confirmDialog("Mark this order as 'Sent' again", "Didn't you receive this product?", "No, I didn't", event);
                            $mdDialog.show(dialog).then(function () {
                                updateStatus(Purchase.SENT_STATUS, purchase);
                            });
                        }
                    };

                    /**
                     * Takes the user to the purchase details page.
                     *
                     * @param purchase - the purchase.
                     * @param $event - the event that triggered the function.
                     */
                    $scope.purchaseDetails = function(purchase, $event) {
                        ActiveSession.setTempData("PURCHASE", purchase);
                        $location.path("/purchase/" + purchase.id);
                    };

                    /**
                     * Updates the status of the purchase via the Purchase service.
                     * @param status - the new status to update.
                     * @param purchase - the purchase object.
                     */
                    function updateStatus(status, purchase) {
                        Purchase.updateStatus(status, purchase)
                            .then(function (response) {
                                // success
                                purchase.status = status;
                            }, function (err) {
                                // failure
                                console.log("Couldn't update the status of the purchase :(");
                            });
                    }

                    /**
                     * Presents the alert dialog when there is an invalid field.
                     *
                     * @param title - the title of the alert dialog.
                     * @param content - the content of the alert dialog.
                     * @param confirm - the confirm button title.
                     * @param ev - the event that triggered the alert.
                     */
                    function confirmDialog(title, content, confirm, ev) {
                        return $mdDialog.confirm(ev)
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(false)
                            .title(title)
                            .textContent(content)
                            .ariaLabel('Confirm Dialog')
                            .ok(confirm)
                            .cancel("Cancel")
                            .targetEvent(ev);
                    }
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
                        } else {
                            return "Mark as sent";
                        }
                    };

                    /**
                     * Changes the status of the purchase (toggles between "Received" and "Sent").
                     *
                     * @param event - the event that triggered the function.
                     * @param purchase - the purchase object.
                     */
                    $scope.changeStatus = function (event, purchase) {
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
                                            updateEstimatedDeliveryTime(numOfDays, purchase);
                                            updateStatus(Purchase.SENT_STATUS, purchase);
                                            return;
                                        }
                                    }
                                }
                                showAlertDialog(event);
                            });
                        } else if (purchase.status == Purchase.SENT_STATUS) {
                            dialog = confirmDialog("Mark this order as 'Purchased' again", "Didn't you send this product?", "No, I didn't", event);
                            $mdDialog.show(dialog).then(function () {
                                updateStatus(Purchase.PURCHASED_STATUS, purchase);
                            });
                        }
                    };

                    /**
                     * Takes the user to the purchase details page.
                     *
                     * @param purchase - the purchase.
                     * @param $event - the event that triggered the function.
                     */
                    $scope.purchaseDetails = function(purchase, $event) {
                        ActiveSession.setTempData("PURCHASE", purchase);
                        $location.path("/purchase/" + purchase.id);
                    };

                    /**
                     * Updates the status of the purchase via the Purchase service.
                     * @param status - the new status to update.
                     * @param purchase - the purchase object.
                     */
                    function updateStatus(status, purchase) {
                        Purchase.updateStatus(status, purchase)
                            .then(function (response) {
                                // success
                                purchase.status = status;
                            }, function (err) {
                                // failure
                                console.log("Couldn't update the status of the purchase :(");
                            });
                    }

                    /**
                     * Updates the estimated delivery time of the purchase via the Purchase service.
                     * @param numOfDays - the number of days until arrival.
                     * @param purchase - the purchase object.
                     */
                    function updateEstimatedDeliveryTime(numOfDays, purchase) {
                        Purchase.updateEstimatedDeliveryTime(numOfDays, purchase)
                            .then(function (response) {
                                // success
                                purchase.estimated_delivery_time = numOfDays;
                            }, function (err) {
                                // failure
                                console.log("Couldn't update the estimated delivery time of the purchase :(");
                            });
                    }

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
                     * Presents the confirm dialog.
                     *
                     * @param title - the title of the alert dialog.
                     * @param content - the content of the alert dialog.
                     * @param confirm - the confirm button title.
                     * @param ev - the event that triggered the alert.
                     */

                    function confirmDialog(title, content, confirm, ev) {
                        return $mdDialog.confirm(ev)
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(false)
                            .title(title)
                            .textContent(content)
                            .ariaLabel('Confirm Dialog')
                            .ok(confirm)
                            .cancel("Cancel")
                            .targetEvent(ev);
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
                }
            }
        });
})();
