(function(){
	'use strict';
	
	angular.module('DealersApp', ['ngAnimate', 'ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMaterial'])
	.run(['$rootScope', '$location', '$cookies', '$http', 'DealerPhotos', function($rootScope, $location, $cookies, $http, DealerPhotos) {
		
		// global variables
		$rootScope.baseUrl = 'http://api.dealers-web.com';
		$rootScope.AWSKey = 'AKIAIWJFJX72FWKD2LYQ';
		$rootScope.AWSSecretKey = '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';
		$rootScope.AWSS3Bucket = 'dealers-app';
		
		// AWS configuration
		AWS.config.update({
			    accessKeyId: $rootScope.AWSKey,
			    secretAccessKey: $rootScope.AWSSecretKey
			});
		AWS.config.region = 'eu-west-1';
		
		// S3 configuration
		$rootScope.s3 = new AWS.S3();
		
        // keep user logged in after page refresh
        if ($cookies.get('globals') !== '[object Object]') { // checking if there's an object in the cookies key
        	$rootScope.globals = $cookies.getObject('globals') || {};
        
	        if ($rootScope.globals.currentUser) {
	            $http.defaults.headers.common['Authorization'] = 'Token ' + $rootScope.globals.currentUser.token;
	            // get the dealer object from the local storage
	            var dealerString = localStorage.getItem('dealer');
	            if (dealerString) {
	            	$rootScope.dealer = JSON.parse(dealerString);
	            	$rootScope.userProfilePic = "";
	            	$rootScope.userProfilePicSender = "user-profile-pic";
	            	// if user has profile pic, download it.
	            	var dealer = $rootScope.dealer;
	            	var photo = $rootScope.dealer.photo;
	            	if (photo != "None") {
		            	DealerPhotos.getPhoto(photo, dealer.id, $rootScope.userProfilePicSender);
			        	$rootScope.$on('downloaded-' + $rootScope.userProfilePicSender + '-profile-pic-' + dealer.id, function(event, args) {
			          		if (args.success) {
			          			$rootScope.userProfilePic = args.data;
			          		} else {
			          			$rootScope.userProfilePic = null;
								console.log(args.message);
			          		}
			        	});	
			        }
	            }
	        }
 		}
 		
 		// Categories
 		$rootScope.categories = [
 			"Art", 
 			"Automotive", 
 			"Beauty & Personal Care", 
 			"Books & Magazines", 
 			"Electronics", 
 			"Entertainment & Events", 
 			"Fashion", 
 			"Food & Groceries",
 			"Home & Forniture",
 			"Kids & Babies",
 			"Music",
 			"Pets",
 			"Restaurants & Bars",
 			"Sports & Outdoor",
 			"Travel",
 			"Other"
 		];
 		
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/home', '/login', '/sign-up']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/home');
            } else if (!restrictedPage && loggedIn) {
            	$location.path('/my-feed');
            }
        });
	}]);
})();
