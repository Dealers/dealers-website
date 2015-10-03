(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('SignUpController', ['$scope', function($scope) {
				
		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = true;
		};
		
		$scope.dateOfBirth = null;
		$scope.opened = false;
		$scope.maxDate = new Date();				
	}]);
})();