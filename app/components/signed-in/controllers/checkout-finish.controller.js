/**
 * Created by gullumbroso on 04/07/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')

        .controller('CheckoutFinishController', ['$scope', '$rootScope', '$location', '$mdDialog', 'ActiveSession',
            function ($scope, $rootScope, $location, $mdDialog, ActiveSession) {
                
                $scope.product = ActiveSession.getTempData("PRODUCT");

                checkIfProductExists();

                /**
                 * Checks if there is a product object in the AddProduct service. If not, then move to the home page.
                 */
                function checkIfProductExists() {
                    if (!$scope.product) {
                        $location.path("/home");
                    }
                }

                $scope.done = function () {
                    $location.path("/home");
                };

                $scope.$on('$destroy', function () {
                    ActiveSession.removeTempData("PRODUCT");
                })
            }]);
})();