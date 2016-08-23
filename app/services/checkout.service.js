/**
 * Created by gullumbroso on 22/08/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
        .factory('Checkout', CheckoutFactory);

    CheckoutFactory.$inject = ['$http', '$rootScope', 'Product', 'ProductPhotos'];
    function CheckoutFactory($http, $rootScope, Product, ProductPhotos) {

        var CO_SESSION = 'coSession';

        var service = {};

        service.product = {};
        service.purchase = {};
        service.saveSession = saveSession;
        service.retrieveSavedSession = retrieveSavedSession;
        service.clearSession = clearSession;

        return service;

        /**
         * Saves the current purchase session in the local storage.
         * @param purchase - the purchase object ot save.
         */
        function saveSession (purchase) {
            if (purchase) {
                service.purchase = purchase;
                try {
                    localStorage.setItem(CO_SESSION, JSON.stringify(purchase));
                }
                catch (err) {
                    console.log("Couldn't save product's data: " + err);
                }
            } else {
                console.log("No product to save to the local storage.");
            }
        }

        /**
         * Retrieves the saved session from the local storage.
         * @returns {*}
         */
        function retrieveSavedSession () {
            var purchaseString = localStorage.getItem(CO_SESSION);
            if (purchaseString) {
                service.purchase = JSON.parse(purchaseString);
                return service.purchase;
            } else {
                return null;
            }
        }

        /**
         * Clears the current purchase session.
         */
        function clearSession () {
            service.product = {};
            localStorage.removeItem(CO_SESSION);
        }
    }
})();