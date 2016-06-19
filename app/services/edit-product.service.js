/*
 *  Manages information regarding the current session of adding a product.
 */
(function () {
    'use strict';

    angular.module('DealersApp')
        .factory('EditProduct', EditProductFactory);

    EditProductFactory.$inject = ['$http', '$rootScope', '$routeParams', 'Product', 'ProductPhotos'];
    function EditProductFactory($http, $rootScope, $routeParams, Product, ProductPhotos) {

        var EP_SESSION = 'epSession';
        var UPLOAD_STARTED_MESSAGE = 'ep-upload-started';
        var UPLOAD_FINISHED_MESSAGE = 'ep-upload-finished';
        var EP_SESSION_PHOTOS = 'epSessionPhotos';
        var EDIT_PRODUCT_PATH = '/adddeals/';
        
        var service = {};
        service.product = {};
        service.savedPhotosURLs = [];
        service.uploadModifiedProduct = uploadModifiedProduct;
        return service;

        /**
         * Runs the functions that is responsible for uploading the product to the server.
         * @param product - the product to upload.
         */
        function uploadModifiedProduct(product) {
            service.product = product;
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
            service.product.category = Product.keyForCategory(service.product.category);
        }

        function uploadData() {
            var data = Product.extractData(service.product);
            $http.patch($rootScope.baseUrl + EDIT_PRODUCT_PATH + service.product.id + '/', data)
                .then(function (response) {
                    console.log("Product uploaded successfully!");
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: true, message: null});
                }, function (err) {
                    console.log("There was an error while uploading the product: " + err.data);
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: false, message: err.data});
                });
        }
    }
})();