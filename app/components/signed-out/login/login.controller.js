(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('LoginController', ['$scope', 'Dealer', function($scope, Dealer) {
					
		function showError(message) {
			$scope.buttonTitle = "Log In";
    		$scope.errorMessage = message;
          	$scope.showError = true;
    	};
        	
    	function hideError() {
    		$scope.buttonTitle = "Log In";
    		$scope.errorMessage = "";		
            $scope.showError = false;
    	}			
		
		hideError();
		
		$scope.login = function(form) {
			
			if (!form.$valid) {
				if (!form.email.$viewValue || form.email.$viewValue === "") {
					showError("Please enter your email!");
				} else if (form.email.$invalid) {
					showError("The email you entered is not valid");
				} else if (!form.password.$viewValue || form.password.$viewValue === "") {
					showError("Please enter your password!");
				} else {
					showError("There are unvalid fields!");
				}
				return;
			} else {
				$scope.showError = false;
				$scope.buttonTitle = "Loading...";
			}
			
			Dealer.login($scope.email, $scope.password)
			.then(function (response) {
                // success
                var dealer = response.data.results[0];
                Dealer.saveCurrent(dealer);
                Dealer.setCredentials($scope.email, $scope.password); // Waiting for 'credentials-set' $broadcast.
            },
            function (httpError) {
              	// error
              	console.log(httpError.status + " : " + httpError.data);
              	showError(httpError.data.detail);
            });
              
          	$scope.$on('credentials-set', function(event, args) {
          		if (args.success) {
              		console.log("Set credentials successfully! Get in!");
					hideError();
					// Get in the system!
          		} else {
              		console.log("Couldn't get token...");
              		showError("There was a problem. Please try again");
          		}
        	});
		};						
	}]);
})();