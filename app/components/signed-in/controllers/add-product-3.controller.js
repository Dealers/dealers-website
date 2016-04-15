(function () {
    'use strict';

    angular.module('DealersApp')

        /**
         * The controller that manages the second step of the Add Product Procedure.
         */
        .controller('AddProduct3Controller', ['$scope', '$rootScope', '$location', '$mdDialog', 'AddProduct',
            function ($scope, $rootScope, $location, $mdDialog, AddProduct) {

                checkIfProductExists();

                /**
                 * Checks if there is a product object in the AddProduct service. If not, then move to the home page.
                 */
                function checkIfProductExists() {
                    if (AddProduct.getProduct()) {
                        AddProduct.clearSession();
                    } else {
                        $location.path("/home");
                    }
                }

                $scope.done = function() {
                    $location.path("/home");
                }
            }]);
})();