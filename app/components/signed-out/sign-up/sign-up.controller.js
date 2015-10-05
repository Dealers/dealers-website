(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('SignUpController', ['$scope', 'Dealer', function($scope, Dealer) {
					
		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = true;
		};
		
		$scope.showError = false;
		$scope.errorMessage = "";
		$scope.buttonTitle = "Sign Up!";
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
				$scope.showError = true;
				$scope.errorMessage = "There are unvalid fields!";
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
			
			Dealer.create(dealer)
			.then(function (response) {
                // success
                $scope.buttonTitle = "Sign Up!";
				$scope.showError = false;
				$scope.errorMessage = "";
				alert("Signed up successfully!");
              },
              function (httpError) {
              	// error
              	console.log(httpError.status + " : " + httpError.data);
              	var errorString;
              	if (httpError.data.user[0]) {
              		var usernameError = httpError.data.user[0];
              		errorString = usernameError.username[0];
              	} else {
					errorString = "Couldn't sign up, please try again!";
              	}
              	$scope.errorMessage = errorString;
              	$scope.showError = true;
				$scope.buttonTitle = "Sign Up!";
              });
		};						
	}]);
})();