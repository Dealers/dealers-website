(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('DealerPhotos', DealerPhotosFactory);
	
	DealerPhotosFactory.$inject = ['$rootScope'];
	function DealerPhotosFactory($rootScope) {
		
		var ctrl = this;
		ctrl.hexToBase64 = hexToBase64;
		
		var service = {};
		
		service.getPhoto = getPhoto;
		service.hasProfilePic = hasProfilePic;
		
		return service;
		
		function hasProfilePic(photoAdderss) {
			/*
			 * Determines if the dealer has a profile picture or not.
			 */
			return (photoAdderss.length > 2) && (photoAdderss != "None");
		}
		
		function getPhoto(key, dealerID, sender) {
			/*
			 * Downloads the photo of the dealer, and returns it to whoever asked for it (sender parameter).
			 */
			$rootScope.s3.getObject(
				{ Bucket: $rootScope.AWSS3Bucket, Key: key, ResponseContentType: "image/jpg"},
				function (error, data) {
					var message;
			    	if (error != null) {
			      		message = "Failed to download dealer's profile pic" + dealerID + ":" + error.message;
			      		$rootScope.$broadcast('downloaded-' + sender + '-profile-pic-' + dealerID, {success: false, message: message});
			    	} else {
			    		message = "Downloaded dealer's profile pic successfully!";
						var blob = new Blob([data.Body], {'type': 'image/png'});
						var url = URL.createObjectURL(blob);
			      		$rootScope.$broadcast('downloaded-' + sender + '-profile-pic-' + dealerID, {success: true, data: url});
			  		}
				}
			);
		}
		
		function hexToBase64(str) {
		    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
		}
	}
})();

