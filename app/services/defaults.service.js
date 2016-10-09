/**
 * Created by gullumbroso on 20/09/2016.
 */

angular.module('DealersApp')
/**
 * Providing functions for saving default settings for a user.
 */
    .factory('Defaults', ['$http', '$rootScope', 'Authentication', function DefaultsFactory($http, $rootScope, Authentication) {

        var DEALER_DEFAULTS_PATH = "/dealer_defaults/";

        var service = {};

        service.updateShippingMethods = updateShippingMethods;

        return service;

        /**
         * Updates the default values of the shipping methods of the dealer in the server.
         * @param product - the new product from which the shipping methods should be taken.
         * @param dealer - the dealer.
         */
        function updateShippingMethods(product, dealer) {
            var data = {};
            if (product.dealers_delivery) {
                data.dealers_delivery = product.dealers_delivery.id;
            } else {
                data.dealers_delivery = null;
            }
            if (product.custom_delivery) {
                data.custom_delivery = product.custom_delivery.id;
            } else {
                data.custom_delivery = null;
            }
            if (product.pickup_delivery) {
                data.pickup_delivery = product.pickup_delivery.id;
            } else {
                data.pickup_delivery = null;
            }
            $http.patch($rootScope.baseUrl + DEALER_DEFAULTS_PATH + dealer + '/', data)
                .then(function (response) {
                    console.log("Saved the shipping methods as default successfully!");
                }, function (err) {
                    console.log("There was an error while trying to save the shipping methods as defaults: " + err.data);
                });
        }
    }]);