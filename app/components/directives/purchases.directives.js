/**
 * Created by gullumbroso on 18/06/2016.
 */
angular.module('DealersApp')
    .directive('updateStatusBuyer', ['$mdDialog', 'Purchase', 'Dialogs', 'Product', 'Translations', function ($mdDialog, Purchase, Dialogs, Product, Translations) {
        return {
            link: function (scope) {

                /**
                 * Changes the status of the purchase (toggles between "Received" and "Sent").
                 *
                 * @param event - the event that triggered the function.
                 * @param purchase - the purchase object.
                 */
                scope.changeBuyerStatus = function (event, purchase) {
                    var dialog;
                    if (purchase.status == Purchase.SENT_STATUS || purchase.status == Purchase.PURCHASED_STATUS) {
                        dialog = Dialogs.confirmDialog(Translations.purchaseDetails.markReceivedConfirmTitle, Translations.purchaseDetails.markReceivedConfirmContent, Translations.general.approve, event);
                        $mdDialog.show(dialog).then(function () {
                            updatePurchase(Purchase.RECEIVED_STATUS, purchase);
                        });
                    } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                        dialog = Dialogs.confirmDialog(Translations.purchaseDetails.markReceivedCancelTitle, Translations.purchaseDetails.markReceivedCancelContent, Translations.purchaseDetails.markReceivedCancelApprove, event);
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

    .directive('updateStatusDealer', ['$mdDialog', 'Purchase', 'Dialogs', 'Product', 'Translations', function ($mdDialog, Purchase, Dialogs, Product, Translations) {
        return {
            link: function (scope) {

                /**
                 * Changes the status of the purchase (toggles between "Received" and "Sent").
                 *
                 * @param event - the event that triggered the function.
                 * @param purchase - the purchase object.
                 */
                scope.changeDealerStatus = function (event, purchase) {
                    var dialog;
                    if (purchase.status == Purchase.PURCHASED_STATUS) {
                        dialog = promptDialog(Translations.purchaseDetails.markSentConfirmTitle,
                            Translations.purchaseDetails.markSentConfirmContent,
                            Translations.purchaseDetails.markSentConfirmPlaceholder,
                            Translations.general.ok,
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
                        dialog = Dialogs.confirmDialog(Translations.purchaseDetails.markSentCancelTitle, Translations.purchaseDetails.markSentCancelContent, Translations.purchaseDetails.markSentCancelApprove, event);
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
                            .title(Translations.purchaseDetails.blankETDTitle)
                            .textContent(Translations.purchaseDetails.blankETDContent)
                            .ariaLabel('Alert Dialog')
                            .ok(Translations.general.gotIt)
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
                        .cancel(Translations.general.cancel);
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
            templateUrl: 'app/components/views/purchases/orders-list.view.html',
            controller: function ($scope, $rootScope, $location, $mdDialog, ActiveSession, Purchase, Product, Translations) {

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
                        return Translations.purchaseDetails.received;
                    } else {
                        return Translations.purchaseDetails.markReceived;
                    }
                };

                /**
                 * Returns the appropriate representation of the purchase's status.
                 * @param purchase - the purchase.
                 * @returns {string} the representation.
                 */
                $scope.parseForPresentation = function (purchase) {
                    if (purchase.status == Purchase.PURCHASED_STATUS) {
                        return Translations.purchaseDetails.purchased;
                    } else if (purchase.status == Purchase.SENT_STATUS) {
                        return Translations.purchaseDetails.sent;
                    } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                        return Translations.purchaseDetails.received;
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
            templateUrl: 'app/components/views/purchases/sales-list.view.html',
            controller: function ($scope, $rootScope, $location, $mdDialog, ActiveSession, Purchase, Product, Translations) {

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
                        return Translations.purchaseDetails.sent;
                    } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                        return Translations.purchaseDetails.received
                    } else {
                        return Translations.purchaseDetails.markSent;
                    }
                };

                /**
                 * Returns the appropriate representation of the purchase's status.
                 * @param purchase - the purchase.
                 * @returns {string} the representation.
                 */
                $scope.parseForPresentation = function (purchase) {
                    if (purchase.status == Purchase.PURCHASED_STATUS) {
                        return Translations.purchaseDetails.purchased;
                    } else if (purchase.status == Purchase.SENT_STATUS) {
                        return Translations.purchaseDetails.sent;
                    } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                        return Translations.purchaseDetails.received;
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
    .directive('totalPriceCalculator', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                present: '=',
                purchase: '=',
                delivery: '='
            },
            templateUrl: 'app/components/views/purchases/total-price-calculator.view.html',
            link: function ($scope) {
                $scope.price = $scope.purchase.amount / 100; // Convert to cents.
                $scope.$watch('present', function () {
                    if ($scope.present) { // Most of the times the delivery object is pending, so should wait for it to populate.
                        $scope.shipping_price = $scope.delivery.shipping_price; // Convert to cents.
                    }
                });
            }
        }
    });