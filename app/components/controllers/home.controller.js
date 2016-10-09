angular.module('DealersApp')
/**
 *
 */
    .controller('HomeController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdMedia',
        function ($scope, $rootScope, $location, $mdDialog, $mdMedia) {

            var DEALERS_PATH = "/dealers/";
            var ALL_PRODUCTS_PATH = "/all-products/";
            var ROLE_DEALER = "Dealer";
            var ROLE_VIEWER = "Viewer";

            if ($rootScope.dealer) {
                $scope.role = $rootScope.dealer.role;
                if ($scope.role == ROLE_VIEWER) {
                    $location.path(ALL_PRODUCTS_PATH);
                } else if ($scope.role == ROLE_DEALER) {
                    $location.path(DEALERS_PATH + $rootScope.dealer.id + '/');
                }
            } else {
                $scope.role = $scope.roles.guest;
            }
            $scope.isHomePage = true;
            $scope.gridTitle = "";
            $scope.gridDescription = "";
            $scope.customFullscreen = $mdMedia('xs');

            setGridTitles();

            /**
             * Sets the title of the grid according to the role of the user.
             */
            function setGridTitles() {
                if ($scope.role == $rootScope.roles.guest) {
                    $scope.gridDescription = "See what people are selling with Dealers";
                }
            }
        }]);