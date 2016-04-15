(function () {
    'use strict';

    angular.module('DealersApp')

        /**
         * All the controllers that are used for general purposes and not confined to a specific page.
         */
        .controller('LoadingDialogController',
            function ($scope, $mdDialog, message) {
                $scope.message = message;
            })
})();