/*
 *  Manages information regarding the current session of adding a product.
 */
(function () {
    'use strict';

    angular.module('DealersApp')
        .factory('AddProduct', AddProductFactory);

    AddProductFactory.$inject = ['$http', '$rootScope', 'Deal'];
    function AddProductFactory($http, $rootScope, Deal) {

        const AP_SESSION = 'apSession';
        const AP_SESSION_PHOTOS = 'apSessionPhotos';
        const KEY = "media/Deals_Photos/";
        const ADD_PRODUCT_PATH = '/adddeals/';
        const EXCEEDED_ERROR_EXCEPTION = "QuotaExceededError";

        var service = {};
        service.product = {};
        service.savedPhotosURLs = [];
        service.getProduct = getProduct;
        service.saveSession = saveSession;
        service.checkForSavedSessions = checkForSavedSessions;
        service.clearSession = clearSession;
        service.uploadProduct = uploadProduct;
        return service;

        function getProduct() {
            return service.product;
        }

        /**
         * Saves the Add Product session to the browser's local storage.
         * @param product - the product that should be saved.
         * @param photosURLs - the urls of the photos that were added.
         */
        function saveSession(product, photosURLs) {
            if (product) {
                service.product = Deal.removePhotoPaths(product);
                var productWithoutPhotos = extractData(service.product);
                try {
                    localStorage.setItem(AP_SESSION, JSON.stringify(productWithoutPhotos));
                }
                catch (err) {
                    console.log("Couldn't save product's data: " + err);
                }
            } else {
                console.log("No product to save to the local storage.");
            }
            // if (photosURLs) {
            //     try {
            //         localStorage.setItem(AP_SESSION_PHOTOS, JSON.stringify(photosURLs));
            //     }
            //     catch (err) {
            //         console.log("Couldn't save product's data: " + err);
            //     }
            // }
        }

        /**
         * Checks if there are saved sessions in the browser's local storage.
         * @return {boolean} - true if there is a saved session, else false.
         */
        function checkForSavedSessions() {
            var productString = localStorage.getItem(AP_SESSION);
            if (productString) {
                service.product = JSON.parse(productString);
                if (service.product.category) {
                    if (service.product.category.length == 2) {
                        // The category consists 2 letters, which means it's a server key. Needs to be converted.
                        service.product.category = Deal.categoryForKey(service.product.category);
                    }
                }
                if (service.product.expiration) {
                    var dateNum = Date.parse(service.product.expiration);
                    service.product.expiration = new Date(dateNum);
                }

                // var photosURLsString = localStorage.getItem(AP_SESSION_PHOTOS);
                // if (photosURLsString) {
                //     service.photosURLs = JSON.parse(photosURLsString);
                // }

                return true;
            } else {
                return false;
            }
        }

        /**
         * Clears the current session that was saved in this service and in the browser's local storage.
         */
        function clearSession() {
            service.product = {};
            service.savedPhotosURLs = [];
            localStorage.removeItem(AP_SESSION);
            localStorage.removeItem(AP_SESSION_PHOTOS);
        }

        /**
         * Remove the raw photos data in order to separate between the photos of the product (that goes to s3) and the
         * actual data that is uploaded to the server.
         * @param product - the product that should be extracted.
         */
        function extractData(product) {
            var extracted = $.extend(true, {}, product);
            delete extracted.photos;
            return extracted;
        }

        /**
         * Runs the functions that responsible for uploading the product to the servers.
         * @param product - the product to upload.
         */
        function uploadProduct(product) {
            $rootScope.$broadcast('ap-upload-started');
            saveSession(product); // Also saves the product to the current service's product attribute.
            setProductProperties();
            uploadPhotos(product.photos);
        }

        /**
         * Sets a few properties of the product in order to make is server-ready.
         */
        function setProductProperties() {
            service.product.dealer = $rootScope.dealer.id;
            service.product.currency = Deal.keyForCurrency(service.product.currency);
            if (service.product.discount_value && service.product.discount_value > 0) {
                service.product.discount_type = Deal.keyForDiscountType(service.product.discount_type);
            } else {
                service.product.discount_type = null;
            }
            service.product.category = Deal.keyForCategory(service.product.category);
            service.product.upload_date = new Date();
            service.product.store = {};
            service.product.dealattribs = {};
            var firstPhoto = new Image();
            firstPhoto.onload = function () {
                service.product.main_photo_width = this.width;
                service.product.main_photo_height = this.height;
            };
            firstPhoto.src = URL.createObjectURL(service.product.photos[0]);
        }

        /**
         * Uploads the photos of the product, and if successful, calls the function that uploads the product's data.
         * @param photos - the photos to upload.
         */
        function uploadPhotos(photos) {
            if (!photos) {
                console.log("The photos array that was sent to the upload function is null!");
                return;
            }
            if (photos.length == 0) {
                console.log("The photos array that was sent to the upload function is empty!");
                return;
            }
            var photoCount = 0;
            for (var i = 0; i < photos.length; i++) {
                var photoName = generatePhotoName(i);
                addPhotoUrlToProduct(i, photoName);
                var params = {
                    Bucket: $rootScope.AWSS3Bucket,
                    Key: KEY + photoName,
                    Body: photos[i]
                };
                $rootScope.s3.putObject(params, function (err, data) {
                    if (err) {
                        // There Was An Error With Your S3 Config
                        console.log("There was an error with s3 config: " + err.message);
                        $rootScope.$broadcast('ap-upload-finished', {success: false, message: message});
                    }
                    else {
                        photoCount++;
                        console.log("Photo number " + photoCount + " upload complete.");
                        if (photoCount == photos.length) {
                            uploadData();
                        }
                    }
                });
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
         */
        function addPhotoUrlToProduct(index, photoName) {
            switch (index) {
                case 0:
                    service.product.photo1 = KEY + photoName;
                    break;
                case 1:
                    service.product.photo2 = KEY + photoName;
                    break;
                case 2:
                    service.product.photo3 = KEY + photoName;
                    break;
                case 3:
                    service.product.photo4 = KEY + photoName;
                    break;
            }
        }

        function uploadData() {
            var data = extractData(service.product);
            $http.post($rootScope.baseUrl + ADD_PRODUCT_PATH, data)
                .then(function (response) {
                    console.log("Product uploaded successfully!");
                    $rootScope.$broadcast('ap-upload-finished', {success: true, message: null});
                    clearSession();
                }, function (err) {
                    console.log("There was an error while uploading the deal: " + err.data);
                    $rootScope.$broadcast('ap-upload-finished', {success: false, message: err.data});
                });
        }
    }
})();