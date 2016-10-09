angular.module('DealersApp')
    .directive('dl-sign-in-dialog', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/sign-in/sign-in-dialog.view.html',
            controller: 'SignInController'
        };
    });