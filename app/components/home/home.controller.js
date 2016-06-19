(function () {
    'use strict';

    angular.module('DealersApp')
        /**
         *
         */
        .controller('HomeController', ['$scope', '$rootScope', '$routeParams', 'Product',
            function ($scope, $rootScope, $routeParams, Product) {

                if ($rootScope.dealer) {
                    $scope.role = $rootScope.dealer.role;
                } else {
                    $scope.role = $scope.roles.guest;
                }
                $scope.gridTitle = "";
                $scope.gridDescription = "";
                
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