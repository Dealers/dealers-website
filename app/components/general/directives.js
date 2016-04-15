(function () {
    'use strict';

    const MAX_PHOTOS = 4;

    angular.module('DealersApp')

        /**
         * Dropdown directive (currently not in use).
         */
        .directive('dlDropdown', ['$location', '$routeParams', '$rootScope', 'Dealer',
            function ($location, $routeParams, $rootScope, Dealer) {

                return {
                    restrict: 'E',
                    scope: {
                        elements: '=list',
                        template: '='
                    },
                    templateUrl: 'app/components/general/dropdown.view.html',
                    controller: ['$scope',
                        function ($scope) {
                            $scope.template = template;
                        }]

                };
            }])

        /**
         * A directive that utilizes the Bootstrap carousel for photos selection.
         */
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
                            scope.showAlertDialog();
                            return;
                        }
                        scope.photos.push(imageFile);
                        var url = URL.createObjectURL(imageFile);
                        scope.photosURLs.push(url);
                        scope.$apply();
                        // var reader = new FileReader();
                        // reader.onload = function (loadEvent) {
                        //     scope.$apply(function () {
                        //         var result = loadEvent.target.result;
                        //         var url = URL.createObjectURL(result);
                        //         scope.photosURLs.push(url);
                        //     });
                        // };
                        // reader.readAsDataURL(imageFile);
                    });
                }
            };
        }).directive('fileDropzone', function () {
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
    }).directive('dlElement', [
        function () {
            var getTemplate = function (template) {
                /**
                 * Returns the right template according to the received 'template' argument.
                 */
                if (template == "category") {
                    return '<a href="/#/categories/{{category}}"><li>{{category}}</li></a>';
                } else if (template == "settings") {
                    return;
                }
            };

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    element: '=',
                    template: '='
                },
                templateUrl: function (element, attrs) {
                    return attrs.template;
                },
                link: function (scope, element) {
                    scope;
                }
            };
        }]);
})();
