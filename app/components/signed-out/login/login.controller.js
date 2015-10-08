(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('LoginController', ['$scope','$location', 'Dealer', function($scope, $location, Dealer) {
					
		this.showError = showError;
		this.hideError = hideError;
		var ctrl = this;		
		
		ctrl.hideError();
		
		$scope.login = function(form) {
			
			if (!form.$valid) {
				if (!form.email.$viewValue || form.email.$viewValue === "") {
					ctrl.showError("Please enter your email!");
				} else if (form.email.$invalid) {
					ctrl.showError("The email you entered is not valid");
				} else if (!form.password.$viewValue || form.password.$viewValue === "") {
					ctrl.showError("Please enter your password!");
				} else {
					ctrl.showError("There are unvalid fields!");
				}
				return;
			} else {
				$scope.showError = false;
				$scope.buttonTitle = "Loading...";
			}
			
			Dealer.login($scope.email, $scope.password);
			
            $scope.$on('login', function(event, args) {
          		if (!args.success) {
          			var message = args.message;
					ctrl.showError(message);
          		}
        	});  
              
          	$scope.$on('credentials-set', function(event, args) {
          		if (args.success) {
              		console.log("Set credentials successfully! Get in!");
					ctrl.hideError();
					$location.path('/my-feed');
          		} else {
              		console.log("Couldn't get token...");
              		ctrl.showError("There was a problem. Please try again");
          		}
        	});
		};
		
		
		// Internal methods
        	
    	function showError(message) {
			$scope.buttonTitle = "Log In";
    		$scope.errorMessage = message;
          	$scope.showError = true;
    	}
        	
    	function hideError() {
    		$scope.buttonTitle = "Log In";
    		$scope.errorMessage = "";		
            $scope.showError = false;
    	}						
	}]);
})();