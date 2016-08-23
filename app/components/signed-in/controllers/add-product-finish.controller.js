(function () {
    'use strict';

    angular.module('DealersApp')

        /**
         * The controller that manages the second step of the Add Product Procedure.
         */
        .controller('AddProductFinishController', ['$scope', '$rootScope', '$location', '$mdDialog', 'AddProduct',
            function ($scope, $rootScope, $location, $mdDialog, AddProduct) {

                var PRODUCT_PAGE_BASE_URL = $rootScope.baseUrl + '/products/';

                $scope.product = AddProduct.getProduct();

                checkIfProductExists();

                /**
                 * Checks if there is a product object in the AddProduct service. If not, then move to the home page.
                 */
                function checkIfProductExists() {
                    if (!$scope.product) {
                        $location.path("/home");
                    }
                }

                $scope.done = function() {
                    if ($scope.product) {
                        if ($scope.product.id) {
                            $location.path("/products/" + $scope.product.id);
                            return;
                        }
                    }
                    $location.path("/home");
                };

                $scope.$on('$destroy', function () {
                    AddProduct.clearSession();
                })
            }]);
})();