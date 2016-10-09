/**
 * Created by gullumbroso on 20/09/2016.
 */


angular.module('DealersApp')
    .controller('LoadingDialogController', ['$scope', 'message', function ($scope, message) {
            $scope.message = message;
        }]);