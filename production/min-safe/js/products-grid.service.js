/**
 * Created by gullumbroso on 29/04/2016.
 */

angular.module('DealersApp')
/**
 * This service offer methods to manage and orginize product arrays.
 */
    .factory('ProductsGrid', ['$http', '$rootScope', 'Authentication', function ProductsGridFactory($http, $rootScope, Authentication) {

        var PRODUCTS_IN_CHUNK = 2;

        var service = {};
        service.divideProductsIntoChunks = divideProductsIntoChunks;
        service.addProductsToArray = addProductsToArray;

        return service;

        /**
         * Slices the received array of products into chunks.
         * @param products - the received products array.
         * @returns {Array} - the chunkedArray.
         */
        function divideProductsIntoChunks(products) {
            var chunkedProductsArray = [], productsChunk;
            for (var i = 0; i < products.length; i += PRODUCTS_IN_CHUNK) {
                productsChunk = products.slice(i, i + PRODUCTS_IN_CHUNK);
                chunkedProductsArray.push(productsChunk);
            }
            return chunkedProductsArray;
        }

        /**
         * Adds new products to an existing product array. This method assumes that the first argument (the existing product array) is
         * already divided into chunks.
         * @param products - the existing product array.
         * @param newProducts - the products to add to the existing array.
         * @returns {Array} - the product array that contains the new products.
         */
        function addProductsToArray(products, newProducts) {
            if (products && newProducts) {
                if (products.length == 0) {
                    return divideProductsIntoChunks(newProducts);
                }
                var lastChunk = products[products.length - 1];
                var def = PRODUCTS_IN_CHUNK - lastChunk.length;
                Array.prototype.push.apply(lastChunk, newProducts.splice(0, def));
                newProducts = divideProductsIntoChunks(newProducts);
                Array.prototype.push.apply(products, newProducts);
                return products;
            }
        }
    }]);
