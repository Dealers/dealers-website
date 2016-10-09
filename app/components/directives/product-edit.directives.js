/**
 * Created by gullumbroso on 20/09/2016.
 */

angular.module('DealersApp')
    .directive('shippingMethods', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/views/products/shipping-methods.view.html',
            link: function ($scope, element) {

            }
        }
    });