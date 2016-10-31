/**
 * Created by gullumbroso on 04/07/2016.
 */

angular.module('DealersApp')

    .controller('CheckoutFinishController', ['$scope', '$rootScope', '$location', '$mdDialog', 'ActiveSession',
        function ($scope, $rootScope, $location, $mdDialog, ActiveSession) {

            $scope.product = ActiveSession.getTempData("PRODUCT");
            $scope.hasPurchase = false;
            var purchaseURL;

            checkIfProductExists();

            /**
             * Checks if there is a product object in the AddProduct service. If not, then move to the home page.
             */
            function checkIfProductExists() {
                if (!$scope.product) {
                    $location.path("/home");
                }
            }

            $scope.$on('purchaseSaved', function(event, purchaseID) {
                $scope.hasPurchase = true;
                purchaseURL = '/purchase/' + purchaseID;
            });

            $scope.purchaseDetails = function (event) {
                if (purchaseURL) {
                    $location.path(purchaseURL);
                }
            };

            $scope.done = function () {
                $location.path("/home");
            };

            $scope.$on('$destroy', function () {
                ActiveSession.removeTempData("PRODUCT");
            })
        }]);