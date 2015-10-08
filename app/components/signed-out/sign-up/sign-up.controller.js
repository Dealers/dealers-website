(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('SignUpController', ['$scope', '$location', 'Dealer', function($scope, $location, Dealer) {
				
		this.showError = showError;
		this.hideError = hideError;
		var ctrl = this;
			
		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = true;
		};
		
		ctrl.hideError();
		$scope.opened = false;
		$scope.maxDate = new Date();
		
		$scope.dealer = {
			full_name: "",
			email: "",
			user: {
				username: "",
				password: ""
			},
			date_of_birth: null,
			gender: "",
			register_date: null,
		};
		
		$scope.signDealer = function(form) {
			
			if (!form.$valid) {
				ctrl.showError("There are unvalid fields!");
				return;
			} else {
				$scope.showError = false;
				$scope.buttonTitle = "Loading...";
			}
			
			var dealer = $scope.dealer;
			
			var subEmail = dealer.email;			
			if (subEmail > 30) {
        		dealer.user.username = subEmail.substring(0, 30);
		    } else {
		        dealer.user.username = subEmail;
		    }
			
			if (!dealer.gender) {
				dealer.gender = "Unspecified";
			}
			
			dealer.register_date = new Date();
			
			Dealer.create(dealer);
			
			$scope.$on('sign-up', function(event, args) {
          		if (!args.success) {
          			var message = args.message;
					ctrl.showError(message);
          		}
        	});  
              
          	$scope.$on('credentials-set', function(event, args) {
          		if (args.success) {
					hideError();
					$location.path('/my-feed');
          		} else {
              		showError("There was a problem. Please try again");
          		}
        	});
		};
		
		
		// Internal methods
			
		function showError(message) {
			$scope.buttonTitle = "Sign Up!";
    		$scope.errorMessage = message;
          	$scope.showError = true;
    	}
    	
    	function hideError() {
    		$scope.buttonTitle = "Sign Up!";
    		$scope.errorMessage = "";		
            $scope.showError = false;
    	}						
	}]);
})();