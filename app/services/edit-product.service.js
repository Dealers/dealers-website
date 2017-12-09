/*
 *  Manages information regarding the current session of adding a product.
 */
angular.module('DealersApp')
    .factory('EditProduct', ['$http', '$rootScope', '$routeParams', 'Product', 'ProductPhotos', function EditProductFactory($http, $rootScope, $routeParams, Product, ProductPhotos) {

        var EP_SESSION = 'epSession';
        var UPLOAD_STARTED_MESSAGE = 'ep-upload-started';
        var UPLOAD_FINISHED_MESSAGE = 'ep-upload-finished';
        var EP_SESSION_PHOTOS = 'epSessionPhotos';
        var EDIT_PRODUCT_PATH = '/adddeals/';
        var DELIVERY_PATH = "/deliverys/";

        var service = {};
        service.product = {};
        service.savedPhotosURLs = [];
        service.isAfterEdit = false;
        service.uploadModifiedProduct = uploadModifiedProduct;
        service.deleteVariants = deleteVariants;
        service.postVariant = postVariant;
        return service;

        /**
         * Runs the functions that is responsible for uploading the product to the server.
         * @param product - the product to upload.
         */
        function uploadModifiedProduct(product) {
            service.product = $.extend({}, product);
            setModifiedProductProperties();
            var firstPhoto = new Image();
            firstPhoto.onload = function () {
                service.product.main_photo_width = this.width;
                service.product.main_photo_height = this.height;
                uploadData(); // Need to wait for the image to be loaded because only then it's possible to get the main photo's width and height.
            };
            firstPhoto.src = URL.createObjectURL(service.product.photos[0]);
        }

        /**
         * Sets a few properties of the product in order to make is server-ready.
         */
        function setModifiedProductProperties() {
            service.product.currency = Product.keyForCurrency(service.product.currency);
            if (service.product.discount_value && service.product.discount_value > 0) {
                service.product.discount_type = Product.keyForDiscountType(service.product.discount_type);
            } else {
                service.product.discount_value = null;
                service.product.discount_type = null;
            }
            service.product.dealer = service.product.dealer.id;
            var idx = parseInt(service.product.category);
            service.product.category = Product.keyForCategory($rootScope.categoriesLocal[idx]);
            delete service.product.dealers_delivery;
            delete service.product.custom_delivery;
            delete service.product.pickup_delivery;
        }

        function uploadData() {
            var data = Product.extractData(service.product);
            $http.patch($rootScope.baseUrl + EDIT_PRODUCT_PATH + service.product.id + '/', data)
                .then(function (response) {
                    console.log("Product uploaded successfully!");
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: true, data: response.data});
                }, function (err) {
                    console.log("There was an error while uploading the product: " + err.data);
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: false, message: err.data});
                });
        }

        /**
         * Deletes the received variants from the server.
         * @param variants - the variants to delete.
         */
        function deleteVariants(variants) {
            for (var i = 0; i < variants.length; i++) {
                var varID = variants[i].id;
                if (varID) {
                    $http.delete($rootScope.baseUrl + "/variants/" + varID + "/")
                        .then(function (result) {
                        }, function (err) {
                            console.log("Failed to delete variant.");
                        });
                }
            }
        }

        /**
         * Posts the received variant to the server.
         * @param variant - the variant to post.
         * @return {promise} - the promise object.
         */
        function postVariant(variant) {
            return $http.post($rootScope.baseUrl + "/variants/", variant);
        }
    }]);