angular.module('DealersApp')
    .controller('CategoriesListController', ['$scope', function ($scope) {
        /*
         * The controller that manages the Categories view.
         */
        $scope.elements = $scope.categories;
    }]);