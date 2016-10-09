/**
 * Created by gullumbroso on 30/03/2016.
 */
angular.module('DealersApp')
    .factory('Photos', ['$mdMedia', function PhotosFactory($mdMedia) {

        var service = {};

        service.product = {
            maxWidth: 480,
            quality: 0.6
        };
        var isMobile = $mdMedia('xs') || $mdMedia('sm');

        service.hexToBase64 = hexToBase64;
        service.imageDataToUrls = imageDataToUrls;
        service.dataURItoBlob = dataURItoBlob;
        service.checkIfImageData = checkIfImageData;
        service.preparePhotoForUpload = preparePhotoForUpload;

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
                } catch (err) {
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
            return new Blob([ab], {type: 'image/png'});
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
            } catch (err) {
                console.log("Not a Blob object:\n" + err.message);
                return false;
            }
            if (url.length > 0) {
                return true;
            }
        }

        /**
         * Starts the photo reduction and upload process.
         * @param counter - the photo index (in the photos array, in case there is more than one).
         * @param photoName - the name of the photo.
         * @param photo - the photo to upload.
         * @param uploadFunc - the upload callback function.
         */
        function preparePhotoForUpload(counter, photoName, photo, uploadFunc) {
            var img = document.createElement("img");

            if (isMobile) { // The photo was taken in mobile, need to check orientation before uploading.
                EXIF.getData(photo, function () {
                    var compressionFactor = 0.65;
                    var orientation = EXIF.getTag(this, "Orientation");
                    img.onload = function () {
                        var canvas = createCanvasForImage(img);
                        var ctx = canvas.getContext('2d');
                        var width = canvas.width * compressionFactor;
                        var styleWidth = canvas.style.width * compressionFactor;
                        var height = canvas.height * compressionFactor;
                        var styleHeight = canvas.style.height * compressionFactor;
                        if (orientation > 4) {
                            canvas.width = height;
                            canvas.style.width = styleHeight;
                            canvas.height = width;
                            canvas.style.height = styleWidth;
                        } else {
                            canvas.width = width;
                            canvas.style.width = styleWidth;
                            canvas.height = height;
                            canvas.style.height = styleHeight;
                        }
                        switch (orientation) {
                            case 2:
                                ctx.translate(width, 0);
                                ctx.scale(-1, 1);
                                break;
                            case 3:
                                ctx.translate(width, height);
                                ctx.rotate(Math.PI);
                                break;
                            case 4:
                                ctx.translate(0, height);
                                ctx.scale(1, -1);
                                break;
                            case 5:
                                ctx.rotate(0.5 * Math.PI);
                                ctx.scale(1, -1);
                                break;
                            case 6:
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(0, -height);
                                break;
                            case 7:
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(width, -height);
                                ctx.scale(-1, 1);
                                break;
                            case 8:
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.translate(-width, 0);
                                break;
                        }
                        ctx.drawImage(img, 0, 0, width, height);
                        var dataUrl = canvas.toDataURL('image/jpeg', service.product.quality);
                        var blob = dataURItoBlob(dataUrl);
                        uploadFunc(counter, photoName, blob);
                    };
                    img.src = URL.createObjectURL(photo);
                });

            } else { // The photo was taken in desktop computer.
                var reader = new FileReader();
                reader.onabort = function () {
                    alert("The upload was aborted.");
                };
                reader.onerror = function () {
                    alert("An error occurred while reading the file.");
                };
                reader.onload = function (e) {
                    img.src = e.target.result;
                    var photoBlob;
                    photoBlob = dataURItoBlob(reduceSize(img));
                    uploadFunc(counter, photoName, photoBlob);
                };

                reader.readAsDataURL(photo);
            }
        }

        function contextAccordingToOrientation(canvas, ctx, orientation) {
            switch (orientation) {
                case 2:
                    ctx.translate(width, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    ctx.translate(width, height);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    ctx.translate(0, height);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(0, -height);
                    break;
                case 7:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(width, -height);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-width, 0);
                    break;
            }
            return ctx;
        }

        /**
         * Reduces the size of the photo before upload. Uses the algorithm that was presented in the following Stackoverflow post:
         * http://stackoverflow.com/questions/10333971/html5-pre-resize-images-before-uploading
         * @param image - the image.
         * @returns {string} the image data url.
         */
        function reduceSize(image) {
            var canvas = createCanvasForImage(image);

            while (canvas.width >= (2 * service.product.maxWidth)) {
                canvas = getHalfScaleCanvas(canvas);
            }

            if (canvas.width > service.product.maxWidth) {
                canvas = scaleCanvasWithAlgorithm(canvas);
            }

            return canvas.toDataURL('image/jpeg', service.product.quality);
        }

        /**
         * Creates a canvas object for the received image.
         * @param image - the image.
         * @returns {canvas} - the new canvas object.
         */
        function createCanvasForImage(image) {
            var canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
            return canvas;
        }

        function getHalfScaleCanvas(canvas) {
            var halfCanvas = document.createElement('canvas');
            halfCanvas.width = canvas.width / 2;
            halfCanvas.height = canvas.height / 2;
            halfCanvas.getContext('2d').drawImage(canvas, 0, 0, halfCanvas.width, halfCanvas.height);
            return halfCanvas;
        }

        function scaleCanvasWithAlgorithm(canvas) {
            var scaledCanvas = document.createElement('canvas');
            var scale = service.product.maxWidth / canvas.width;
            scaledCanvas.width = canvas.width * scale;
            scaledCanvas.height = canvas.height * scale;

            var srcImgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            var destImgData = scaledCanvas.getContext('2d').createImageData(scaledCanvas.width, scaledCanvas.height);

            applyBilinearInterpolation(srcImgData, destImgData, scale);

            scaledCanvas.getContext('2d').putImageData(destImgData, 0, 0);

            return scaledCanvas;
        }

        function applyBilinearInterpolation(srcCanvasData, destCanvasData, scale) {
            function inner(f00, f10, f01, f11, x, y) {
                var un_x = 1.0 - x;
                var un_y = 1.0 - y;
                return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
            }

            var i, j;
            var iyv, iy0, iy1, ixv, ix0, ix1;
            var idxD, idxS00, idxS10, idxS01, idxS11;
            var dx, dy;
            var r, g, b, a;
            for (i = 0; i < destCanvasData.height; ++i) {
                iyv = i / scale;
                iy0 = Math.floor(iyv);
                // Math.ceil can go over bounds
                iy1 = (Math.ceil(iyv) > (srcCanvasData.height - 1) ? (srcCanvasData.height - 1) : Math.ceil(iyv));
                for (j = 0; j < destCanvasData.width; ++j) {
                    ixv = j / scale;
                    ix0 = Math.floor(ixv);
                    // Math.ceil can go over bounds
                    ix1 = (Math.ceil(ixv) > (srcCanvasData.width - 1) ? (srcCanvasData.width - 1) : Math.ceil(ixv));
                    idxD = (j + destCanvasData.width * i) * 4;
                    // matrix to vector indices
                    idxS00 = (ix0 + srcCanvasData.width * iy0) * 4;
                    idxS10 = (ix1 + srcCanvasData.width * iy0) * 4;
                    idxS01 = (ix0 + srcCanvasData.width * iy1) * 4;
                    idxS11 = (ix1 + srcCanvasData.width * iy1) * 4;
                    // overall coordinates to unit square
                    dx = ixv - ix0;
                    dy = iyv - iy0;
                    // I let the r, g, b, a on purpose for debugging
                    r = inner(srcCanvasData.data[idxS00], srcCanvasData.data[idxS10], srcCanvasData.data[idxS01], srcCanvasData.data[idxS11], dx, dy);
                    destCanvasData.data[idxD] = r;

                    g = inner(srcCanvasData.data[idxS00 + 1], srcCanvasData.data[idxS10 + 1], srcCanvasData.data[idxS01 + 1], srcCanvasData.data[idxS11 + 1], dx, dy);
                    destCanvasData.data[idxD + 1] = g;

                    b = inner(srcCanvasData.data[idxS00 + 2], srcCanvasData.data[idxS10 + 2], srcCanvasData.data[idxS01 + 2], srcCanvasData.data[idxS11 + 2], dx, dy);
                    destCanvasData.data[idxD + 2] = b;

                    a = inner(srcCanvasData.data[idxS00 + 3], srcCanvasData.data[idxS10 + 3], srcCanvasData.data[idxS01 + 3], srcCanvasData.data[idxS11 + 3], dx, dy);
                    destCanvasData.data[idxD + 3] = a;
                }
            }
        }
    }]);