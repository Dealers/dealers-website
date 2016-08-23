(function () {
    'use strict';

    var MAX_PHOTOS = 4;

    angular.module('DealersApp')

        .directive('tabList', function () {
            return {
                link: function (scope, element) {
                    var button = element.children()[0];
                    $(button).on("click", function (event) {
                        var activeClass = "active";
                        $(element).addClass(activeClass);
                        $(element).siblings().removeClass(activeClass);
                        scope.changeDisplay(event.target.innerText);
                    });
                }
            };
        })

        .directive('carouselItem', function () {
            return {
                replace: true,
                scope: {
                    photo: "=photoUrl"
                },
                templateUrl: 'app/components/general/carousel-item.view.html'
            };
        })

        .directive('photoInput', function () {
            return {
                scope: {
                    photo: "=",
                    photoURL: "=photoUrl"
                },
                link: function (scope, element, attributes) {
                    element.bind("change", function (changeEvent) {
                        var imageFile = changeEvent.target.files[0];
                        if (imageFile == null) {
                            return;
                        }
                        scope.photo = imageFile;
                        scope.photoURL = URL.createObjectURL(imageFile);
                        scope.$apply();
                    });
                }
            };
        })
        .directive('photosInput', function () {
            return {
                scope: {
                    photos: "=",
                    photosURLs: "=photosUrls",
                    showAlertDialog: "&"
                },
                link: function (scope, element, attributes) {
                    element.bind("change", function (changeEvent) {
                        var imageFile = changeEvent.target.files[0];
                        if (imageFile == null || scope.photos.length >= MAX_PHOTOS) {
                            return;
                        }
                        if ($.inArray(imageFile, scope.photos) != -1) {
                            scope.showAlertDialog("Duplicate Photo", "This photo was already uploaded.");
                            return;
                        }
                        scope.photos.push(imageFile);
                        var url = URL.createObjectURL(imageFile);
                        scope.photosURLs.push(url);
                        scope.$apply();
                    });
                }
            };
        })
        .directive('fileDropzone', function () {
            return {
                restrict: 'A',
                scope: {
                    photos: '=',
                    photosURLs: "=photosUrls",
                    showAlertDialog: '&'
                },
                link: function (scope, element, attrs) {
                    var checkSize,
                        isTypeValid,
                        processDragOverOrEnter,
                        validMimeTypes;
                    processDragOverOrEnter = function (event) {
                        if (event != null) {
                            event = event.originalEvent;
                            event.preventDefault();
                        }
                        event.dataTransfer.effectAllowed = 'copy';
                        return false;
                    };
                    validMimeTypes = attrs.fileDropzone;
                    checkSize = function (size) {
                        var _ref;
                        if ((( _ref = attrs.maxFileSize) === (
                                void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                            return true;
                        } else {
                            alert("File must be smaller than " + attrs.maxFileSize + " MB");
                            return false;
                        }
                    };
                    isTypeValid = function (type) {
                        if ((validMimeTypes === (
                                void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                            return true;
                        } else {
                            alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                            return false;
                        }
                    };
                    element.bind('dragover', processDragOverOrEnter);
                    element.bind('dragenter', processDragOverOrEnter);
                    return element.bind('drop', function (event) {
                        var imageFile;
                        if (event != null) {
                            event = event.originalEvent;
                            event.preventDefault();
                        }
                        imageFile = event.dataTransfer.files[0];
                        if (imageFile == null || !checkSize(imageFile.size) || !isTypeValid(imageFile.type)) {
                            return false;
                        }
                        if (scope.photos.length < MAX_PHOTOS) {
                            if ($.inArray(imageFile, scope.photos) == -1) {
                                scope.photos.push(imageFile);
                            } else {
                                scope.showAlertDialog();
                            }
                        }
                        var url = URL.createObjectURL(imageFile);
                        scope.photosURLs.push(url);
                        scope.$apply();
                        return false;
                    });
                }
            };
        })
        /**
         * Adds auto-completion to location input elements.
         */
        .directive('googleLocationAutocomplete', [
            function () {
                return {
                    scope: {
                        location: "="
                    },
                    link: function (scope, element) {

                        var autocomplete = element[0];

                        autocomplete = new google.maps.places.Autocomplete(
                            (element[0]),
                            {types: ['geocode']}
                        );

                        autocomplete.addListener('place_changed', function () {
                            var placeObject = autocomplete.getPlace();
                            if (placeObject) {
                                scope.location = placeObject.formatted_address;
                            }
                        });

                        // Bias the autocomplete object to the user's geographical location,
                        // as supplied by the browser's 'navigator.geolocation' object.
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function (position) {
                                var geolocation = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                };
                                var circle = new google.maps.Circle({
                                    center: geolocation,
                                    radius: position.coords.accuracy
                                });
                                autocomplete.setBounds(circle.getBounds());
                            });
                        }
                    }
                };
            }]);
})();
