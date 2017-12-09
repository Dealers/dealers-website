/*
 *  Manages information regarding the current session of adding a product.
 */
angular.module('DealersApp')
    .factory('AddProduct', ['$http', '$rootScope', 'Product', 'ProductPhotos', function AddProductFactory($http, $rootScope, Product, ProductPhotos) {

        var AP_SESSION = 'apSession';
        var AP_SESSION_PHOTOS = 'apSessionPhotos';
        var ADD_PRODUCT_PATH = '/adddeals/';
        var UPLOAD_STARTED_MESSAGE = 'ap-upload-started';
        var UPLOAD_FINISHED_MESSAGE = 'ap-upload-finished';

        function setListeners() {
            $scope.$on('photos-downloaded-for-' + AP_SESSION, function (event, args) {
                if (args.success) {
                    // Finished uploading photos, start uploading the product's data.
                    uploadData();
                } else {
                    console.log("Couldn't upload the photos. Aborting upload process.");
                }
            });
        }

        var service = {};
        service.product = {};
        service.savedPhotosURLs = [];
        service.getProduct = getProduct;
        service.setProduct = setProduct;
        service.saveSession = saveSession;
        service.checkForSavedSessions = checkForSavedSessions;
        service.clearSession = clearSession;
        service.uploadProduct = uploadProduct;

        return service;

        function getProduct() {
            return service.product;
        }

        function setProduct(product) {
            service.product = product;
        }

        /**
         * Saves the Add Product session to the browser's local storage.
         * @param product - the product that should be saved.
         * @param photosURLs - the urls of the photos that were added.
         */
        function saveSession(product, photosURLs) {
            if (product) {
                var productWithoutPhotos = $.extend({}, product);
                productWithoutPhotos = Product.removePhotoPaths(productWithoutPhotos);
                productWithoutPhotos = Product.extractData(productWithoutPhotos);
                if (typeof productWithoutPhotos.price == "string") {
                    productWithoutPhotos.price = parseFloat(productWithoutPhotos.price);
                }
                try {
                    localStorage.setItem(AP_SESSION, JSON.stringify(productWithoutPhotos));
                }
                catch (err) {
                    console.log("Couldn't save product's data: " + err);
                }
            } else {
                console.log("No product to save to the local storage.");
            }
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
                    if (service.product.category.length == 2 || service.product.category.length == 3) {
                        // The category consists of 2 or 3 letters, which means it's a server key. Needs to be converted.
                        service.product.category = Product.categoryForKey(service.product.category);
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
         * Runs the functions that responsible for uploading the product to the server.
         * @param product - the product to upload.
         */
        function uploadProduct(product) {
            service.product = product;
            saveSession(product);
            setProductProperties();
        }

        /**
         * Sets a few properties of the product in order to make is server-ready.
         */
        function setProductProperties() {
            service.product.dealer = $rootScope.dealer.id;
            service.product.currency = Product.keyForCurrency(service.product.currency);
            if (service.product.discount_value && service.product.discount_value > 0) {
                service.product.discount_type = Product.keyForDiscountType(service.product.discount_type);
            } else {
                service.product.discount_value = null;
                service.product.discount_type = null;
            }
            var idx = parseInt(service.product.category) + 1;
            service.product.category = Product.keyForCategory($rootScope.categoriesLocal[idx]);
            service.product.upload_date = new Date();
            service.product.store = {};
            service.product.dealattribs = {};
            var firstPhoto = new Image();
            firstPhoto.onload = function () {
                service.product.main_photo_width = this.width;
                service.product.main_photo_height = this.height;
                uploadData(); // Need to wait for the image to be loaded because only then it's possible to get its width and height.
            };
            firstPhoto.src = URL.createObjectURL(service.product.photos[0]);
        }

        function uploadData() {
            var data = Product.extractData(service.product);
            $http.post($rootScope.baseUrl + ADD_PRODUCT_PATH, data)
                .then(function (response) {
                    console.log("Product uploaded successfully!");
                    setProduct(response.data);
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: true, message: null, product: response.data});
                }, function (err) {
                    console.log("There was an error while uploading the product: " + err.data);
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: false, message: err.data});
                });
        }
    }]);