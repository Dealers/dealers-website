(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('ProductPhotos', ProductPhotosFactory);
	
	ProductPhotosFactory.$inject = ['$rootScope'];
	function ProductPhotosFactory($rootScope) {

        var KEY = "media/Deals_Photos/";
        var BROADCASTING_PREFIX = 'photos-downloaded-for-';

		var service = {};
		
		service.hasPhoto = hasPhoto;
		service.downloadPhoto = downloadPhoto;
        service.downloadPhotos = downloadPhotos;
        service.photosNum = photosNum;
		service.colorForNum = colorForNum;
        service.generatePhotoName = generatePhotoName;
        service.addPhotoUrlToProduct = addPhotoUrlToProduct;
        service.uploadPhotosOfProduct = uploadPhotosOfProduct;
        service.setProductPhotosInArray = setProductPhotosInArray;
        service.deletePhotos = deletePhotos;
		
		return service;

        /**
         * Determines if the product has photos.
         * @param photoAddress
         * @returns {boolean}
         */
		function hasPhoto(photoAddress) {
			return (photoAddress.length > 2) && (photoAddress != "None");
		}

        /**
         * Downloads the photo from the s3.
         * @param key - the key of the photo.
         * @param productID - the id of the product.
         * @param photoIndex - the index of the photo, if it is one out of a number of photos.
         */
		function downloadPhoto(key, productID, photoIndex) {
			$rootScope.s3.getObject(
				{ Bucket: $rootScope.AWSS3Bucket, Key: key, ResponseContentType: "image/jpg"},
				function (error, result) {
					var data = {};
                    data.photoIndex = photoIndex;
			    	if (error != null) {
			      		data.message = "Failed to download photo of product" + productID + ":\n" + error.message;
			      		$rootScope.$broadcast('downloaded-photo-' + productID, {success: false, data: data});
			    	} else {
                        var blob = new Blob([result.Body], {'type': 'image/png'});
                        data.rawImage = blob;
                        data.url = URL.createObjectURL(blob);
			      		$rootScope.$broadcast('downloaded-photo-' + productID, {success: true, data: data});
			  		}
				}
			);
		}

        /**
         * Downloads the photos of the received product.
         * @param product - the product.
         */
		function downloadPhotos(product) {
            if (product.photo1) {
                downloadPhoto(product.photo1, product.id, 1);
            }
            if (product.photo2) {
                downloadPhoto(product.photo2, product.id, 2);
            }
            if (product.photo3) {
                downloadPhoto(product.photo3, product.id, 3);
            }
            if (product.photo4) {
                downloadPhoto(product.photo4, product.id, 4);
            }
        }

        /**
         * Generates a name to every photo that is about to be uploaded to the s3.
         * @param index - the index of the photo in the product's photos array.
         * @returns {string} - the generated name.
         */
        function generatePhotoName(index) {
            var dealerID = String($rootScope.dealer.id);
            var d = new Date();
            var date = String(d.getTime() / 1000);
            var i = String(index + 1); // Avoiding the 0 indexing
            return dealerID + "_" + date + "_" + i + ".png";
        }

        /**
         * Adds the photos' path and name to the product object.
         * @param index - the index of the photo.
         * @param photoName - the name of the photo.
         * @param key - the s3 key.
         * @param product - the product.
         */
        function addPhotoUrlToProduct(index, photoName, key, product) {
            switch (index) {
                case 0:
                    product.photo1 = key + photoName;
                    break;
                case 1:
                    product.photo2 = key + photoName;
                    break;
                case 2:
                    product.photo3 = key + photoName;
                    break;
                case 3:
                    product.photo4 = key + photoName;
                    break;
            }
        }

        /**
         * Clears the photo urls of the received product.
         * @param product - the product.
         * @returns {product} the product with blank photo urls.
         */
        function clearPhotosUrlsOfProduct(product) {
            if (product.photo1) {
                product.photo1 = "";
            }
            if (product.photo2) {
                product.photo2 = "";
            }
            if (product.photo3) {
                product.photo3 = "";
            }
            if (product.photo4) {
                product.photo4 = "";
            }
            return product;
        }

        /**
         * Returns the number of photos the product has.
         * @param product - the product.
         * @return {int} - the number of photos the product has.
         */
        function photosNum(product) {
            var count = 0;
            if (product.photo1)
                count++;
            if (product.photo2)
                count++;
            if (product.photo3)
                count++;
            if (product.photo4)
                count++;
            return count;
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

        /**
         * Uploads the photos of the received product.
         * @param product - the product to which the photos belong.
         * @param sender - the originator of this process.
         */
        function uploadPhotosOfProduct(product, sender) {
            var photos = product.photos;
            if (!photos) {
                console.log("The photos array that was sent to the upload function is null!");
                $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {success: false, data: "There was a problem, please try again!"});
                return;
            }
            if (photos.length == 0) {
                console.log("The photos array that was sent to the upload function is empty!");
                $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {success: false, data: "There was a problem, please try again!"});
                return;
            }
            var photoCount = 0;
            product = clearPhotosUrlsOfProduct(product);
            for (var i = 0; i < photos.length; i++) {
                var photoName = generatePhotoName(i);
                addPhotoUrlToProduct(i, photoName, KEY, product);
                var params = {
                    Bucket: $rootScope.AWSS3Bucket,
                    Key: KEY + photoName,
                    Body: photos[i]
                };
                $rootScope.s3.putObject(params, function (err, data) {
                    if (err) {
                        // There Was An Error With Your S3 Config
                        console.log("There was an error with s3 config: " + err.message);
                        $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {success: false, data: err.message});
                    }
                    else {
                        photoCount++;
                        console.log("Photo number " + photoCount + " upload complete.");
                        if (photoCount == photos.length) {
                            $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {success: true, data: data, product: product});
                        }
                    }
                });
            }
        }

        /**
         * Sets the photo urls of the received product in an array, and returns it.
         * @param product - the product.
         * @returns {Array} - the array of photo urls.
         */
        function setProductPhotosInArray(product) {
            var photoURL = [];
            if (product.photo1) {
                photoURL.push(product.photo1);
            }
            if (product.photo2) {
                photoURL.push(product.photo2);
            }
            if (product.photo3) {
                photoURL.push(product.photo3);
            }
            if (product.photo4) {
                photoURL.push(product.photo4);
            }
            return photoURL;
        }

        function deletePhotos(photosToDelete) {
            for (var i = 0; i < photosToDelete.length; i++) {
                var params = {
                    Bucket: $rootScope.AWSS3Bucket,
                    Key: KEY + photosToDelete[i]
                };
                $rootScope.s3.deleteObject(params, function(err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                    }
                    else {
                        console.log("Old photo was deleted successfully!\n" + data); 
                    }
                });
            }

        }
	}
})();

