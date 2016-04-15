(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('DealPhotos', DealPhotosFactory);
	
	DealPhotosFactory.$inject = ['$rootScope'];
	function DealPhotosFactory($rootScope) {

		var service = {};
		
		service.hasPhoto = hasPhoto;
		service.getPhoto = getPhoto;
		service.colorForNum = colorForNum;
		
		return service;
		
		function hasPhoto(photoAdderss) {
			/*
			 * Determines if the deal has a photo.
			 */
			return (photoAdderss.length > 2) && (photoAdderss != "None");
		}
		
		function getPhoto(key, dealID) {
			$rootScope.s3.getObject(
				{ Bucket: $rootScope.AWSS3Bucket, Key: key, ResponseContentType: "image/jpg"},
				function (error, data) {
					var message;
			    	if (error != null) {
			      		message = "Failed to download photo of deal" + dealID + ":" + error.message;
			      		$rootScope.$broadcast('downloaded-photo-' + dealID, {success: false, message: message});
			    	} else {
			    		message = "Downloaded deal photo successfully!";
						var blob = new Blob([data.Body], {'type': 'image/png'});
						var url = URL.createObjectURL(blob);
			      		$rootScope.$broadcast('downloaded-photo-' + dealID, {success: true, data: url});
			  		}
				}
			);
		}
		
		function colorForNum(num) {
			switch(parseInt(num, 10)) {
			    case 0:
			        return "rgb(79,195,247)";
			        break;
			    case 1:
			        return "rgb(129,216,132)";
			        break;
			    case 2:
			        return "rgb(255,100,105)";
			        break;
			    case 3:
			        return "rgb(255,212,40)";
				    break;
			    default:
			        return "rgb(79,195,247)";
			        break;
			}
		}
	}
})();

