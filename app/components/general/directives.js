(function () {
    'use strict';

	angular.module('DealersApp')
	.directive('dlDropdown', ['$location', '$routeParams', '$rootScope', 'Dealer', function($location, $routeParams, $rootScope, Dealer) {
		return {
			restrict: 'E',
			scope: {
				elements: '=list'
			},
			templateUrl: 'app/components/general/dropdown.view.html',
			link: function(scope, element) {
			}
		};
	}]);
})();
