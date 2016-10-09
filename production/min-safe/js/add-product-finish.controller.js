angular.module('DealersApp')

/**
 * The controller that manages the second step of the Add Product Procedure.
 */
    .controller('AddProductFinishController', ['$scope', '$rootScope', '$location', '$timeout', '$mdDialog', 'AddProduct',
        function ($scope, $rootScope, $location, $timeout, $mdDialog, AddProduct) {

            var PRODUCT_PAGE_BASE_URL = $rootScope.baseUrl + '/products/';

            $scope.didntShare = true;
            $scope.didShare = false;
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

            $scope.switchDidShare = function (event) {
                $timeout(function () {
                    $scope.didntShare = false;
                }, 2000);
                $timeout(function () {
                    $scope.didShare = true;
                }, 2500);
            };

            $scope.done = function () {
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