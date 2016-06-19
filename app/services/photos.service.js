/**
 * Created by gullumbroso on 30/03/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
        .factory('Photos', PhotosFactory);

    PhotosFactory.$inject = ['$rootScope'];
    function PhotosFactory($rootScope) {

        var service = {};

        service.hexToBase64 = hexToBase64;
        service.imageDataToUrls = imageDataToUrls;
        service.dataURItoBlob = dataURItoBlob;
        service.checkIfImageData = checkIfImageData;

        return service;

        function hexToBase64(str) {
            return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
        }

        /**
         * Receives an array with images data, and returns an array of urls for presentation in html.
         * @param data - the data to present.
         * @returns {Array} - the array of urls.
         */
        function imageDataToUrls(data) {
            var urls = [];
            for (var i = 0; i < data.length; i++) {
                try {
                    urls.push(URL.createObjectURL(data[i]));
                } catch(err) {
                    console.log(err.message);
                }
            }
            return urls;
        }

        /**
         * Converts data uri objects to blobs.
         * @param dataURI - the data uri of the photo.
         * @returns {blob} - blob object
         */
        function dataURItoBlob(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: 'image/png' });
        }

        /**
         * Checks to see if the createObjectURL method is callable on the received object. If so, it will indicate that
         * the received object is indeed an image data file.
         * @param object - the object to check.
         * @returns {boolean} - true if the method is callable on the object, else false.
         */
        function checkIfImageData(object) {
            var url;
            try {
                url = URL.createObjectURL(object);
            } catch(err) {
                console.log("Not a Blob object:\n" + err.message);
                return false;
            }
            if (url.length > 0) {
                return true;
            }
        }
    }
})();