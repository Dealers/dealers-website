(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('DealPhotos', DealPhotosFactory);
	
	DealPhotosFactory.$inject = ['$rootScope'];
	function DealPhotosFactory($rootScope) {
		
		var ctrl = this;
		ctrl.hexToBase64 = hexToBase64;
		var s3 = new AWS.S3();
		
		var service = {};
		
		service.getPhoto = getPhoto;
		service.colorForNum = colorForNum;
		
		return service;
		
		function getPhoto(key, dealID) {
			s3.getObject(
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
		
		function hexToBase64(str) {
		    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
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

