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

    PurchaseFactory.$inject = ['$http', '$rootScope'];
    function PurchaseFactory($http, $rootScope) {

        var PURCHASES_SOURCE = $rootScope.baseUrl + '/purchases/';
        var ORDERS_SOURCE = $rootScope.baseUrl + "/orders/";
        var SALES_SOURCE = $rootScope.baseUrl + "/sales/";

        var service = {};

        service.PURCHASED_STATUS = "Purchased";
        service.SENT_STATUS = "Sent";
        service.RECEIVED_STATUS = "Received";

        service.getOrders = getOrders;
        service.getSales = getSales;
        service.addPurchase = addPurchase;
        service.updateStatus = updateStatus;

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

        /**
         * Posts the purchase information to the server.
         * @param charge - the purchase information.
         * @param product - the purchased product.
         */
        function addPurchase(charge, product) {
            var purchase = {
                buyer: charge.buyer,
                dealer: charge.dealer,
                deal: product.id,
                amount: charge.amount,
                purchase_date: new Date(),
                status: "Purchased"
            };
            $http.post($rootScope.baseUrl + '/purchases/', purchase)
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
         * Updates the status of the purchase.
         *
         * @param newStatus - the new status of the purchase.
         * @param purchase - the purchase object to update.
         * @returns the callback function of the $http.patch function.
         */
        function updateStatus(newStatus, purchase) {
            var data = { status: newStatus };
            if (newStatus == service.SENT_STATUS && purchase.status == service.PURCHASED_STATUS) {
                data.send_date = new Date();
            } else if (newStatus == service.RECEIVED_STATUS && purchase.status == service.SENT_STATUS) {
                data.receive_date = new Date();
            } else if (newStatus == service.PURCHASED_STATUS && purchase.status == service.SENT_STATUS) {
                data.send_date = null;
            } else if (newStatus == service.SENT_STATUS && purchase.status == service.RECEIVED_STATUS) {
                data.receive_date = null;
            }
            return $http.patch(PURCHASES_SOURCE + purchase.id + '/', data)
        }
    }
})();
