/**
 * Created by gullumbroso on 18/06/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
    /**
     * This service offer methods to download and post purchases data.
     */
        .factory('Purchase', PurchaseFactory);

    PurchaseFactory.$inject = ['$http', '$rootScope', 'Product'];
    function PurchaseFactory($http, $rootScope, Product) {

        var PURCHASES_SOURCE = $rootScope.baseUrl + '/purchases/';
        var ORDERS_SOURCE = $rootScope.baseUrl + "/orders/";
        var SALES_SOURCE = $rootScope.baseUrl + "/sales/";

        var service = {};

        service.PURCHASED_STATUS = "Purchased";
        service.SENT_STATUS = "Sent";
        service.RECEIVED_STATUS = "Received";

        service.getOrders = getOrders;
        service.getSales = getSales;
        service.getPurchase = getPurchase;
        service.addPurchase = addPurchase;
        service.updatePurchase = updatePurchase;
        service.updateEstimatedDeliveryTime = updateEstimatedDeliveryTime;

        return service;

        /**
         * Returns the orders that the user made.
         *
         * @param userID - the id of the user.
         * @returns the callback of the $http.get function.
         */
        function getOrders(userID) {
            return $http.get(ORDERS_SOURCE + userID + '/');
        }

        /**
         * Returns the sales of the dealer.
         *
         * @param dealerID - the id of the dealer.
         * @returns the callback of the $http.get function.
         */
        function getSales(dealerID) {
            return $http.get(SALES_SOURCE + dealerID + '/');
        }

        function getPurchase(purchaseID) {
            return $http.get(PURCHASES_SOURCE + purchaseID + '/');
        }

        /**
         * Posts the purchase information to the server.
         * @param purchase - the purchase object.
         */
        function addPurchase(purchase) {
            purchase.purchase_date = new Date();
            $http.post(PURCHASES_SOURCE, purchase)
                .then(function (response) {
                        // success
                        console.log("Purchase saved.");
                    },
                    function (httpError) {
                        // error
                        console.log("Couldn't save the purchase data.");
                    });
        }

        /**
         * Updates the purchase object.
         *
         * @param newStatus - the new status of the purchase.
         * @param purchase - the purchase object to update.
         * @returns the callback function of the $http.patch function.
         */
        function updatePurchase(newStatus, purchase) {
            if (newStatus == service.SENT_STATUS && purchase.status == service.PURCHASED_STATUS) {
                purchase.send_date = new Date();
            } else if (newStatus == service.RECEIVED_STATUS && purchase.status == service.SENT_STATUS) {
                purchase.receive_date = new Date();
            } else if (newStatus == service.PURCHASED_STATUS && purchase.status == service.SENT_STATUS) {
                purchase.send_date = null;
                purchase.estimated_delivery_time = null;
            } else if (newStatus == service.SENT_STATUS && purchase.status == service.RECEIVED_STATUS) {
                purchase.receive_date = null;
            }
            purchase.status = newStatus;
            purchase = preparePurchaseForServer(purchase);
            return $http.patch(PURCHASES_SOURCE + purchase.id + '/', purchase)
        }

        /**
         * Maps all the relevant properties to the matching values in the server.
         * @param purchase - the purchase object.
         * @returns {purchase} the mapped purchase object.
         */
        function preparePurchaseForServer(purchase) {
            purchase.currency = Product.keyForCurrency(purchase.currency);
            if (purchase.dealer.id) {
                purchase.dealer = purchase.dealer.id;
            }
            if (purchase.deal.id) {
                purchase.deal = purchase.deal.id;
            }
            if (purchase.buyer.id) {
                purchase.buyer = purchase.buyer.id;
            }
            return purchase;
        }

        /**
         * Updates the estimated delivery time of the purchase.
         *
         * @param estimatedDeliveryTime - the estimated delivery time of the purchase.
         * @param purchase - the purchase object to update.
         * @returns the callback function of the $http.patch function.
         */
        function updateEstimatedDeliveryTime(estimatedDeliveryTime, purchase) {
            if (estimatedDeliveryTime >= 0) {
                var data = { estimated_delivery_time: estimatedDeliveryTime };
                return $http.patch(PURCHASES_SOURCE + purchase.id + '/', data);
            }
            console.log("Invalid estimated delivery time value.");
        }
    }
})();
