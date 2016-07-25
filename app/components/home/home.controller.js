(function () {
    'use strict';

    angular.module('DealersApp')
        /**
         *
         */
        .controller('HomeController', ['$scope', '$rootScope', '$mdDialog', '$mdMedia',
            function ($scope, $rootScope, $mdDialog, $mdMedia) {

                if ($rootScope.dealer) {
                    $scope.role = $rootScope.dealer.role;
                } else {
                    $scope.role = $scope.roles.guest;
                }
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
})();