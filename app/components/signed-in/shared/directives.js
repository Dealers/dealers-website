(function () {
    'use strict';

	angular.module('DealersApp')
	.directive('dlNavbar', ['$location', 'Dealer', function($location, Dealer) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/signed-in/shared/navbar.view.html',
			link: function(scope, element) {
				scope.logOut = function () {
					Dealer.logOut();
					$location.path('/');
				};
			}
		};
	}]);

})();
