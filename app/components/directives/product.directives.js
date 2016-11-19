angular.module('DealersApp')
    .directive('productPrice', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                ngModel.$parsers.push(function (value) {
                    value = parseFloat(value);
                    if (value) {
                        value = Math.round(value * 100) / 100; // Keep 2 decimals.
                        return value;
                    }
                });
                ngModel.$formatters.push(function (value) {
                    value = parseFloat(value);
                    if (value) {
                        value = Math.round(value * 100) / 100; // Keep 2 decimals.
                        return value;
                    }
                });
            }
        }
    })
    .directive('productPercentageOff', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                ngModel.$parsers.push(function (value) {
                    value = parseFloat(value);
                    if (value) {
                        if (value > 100 || value < 0) {
                            ngModel.$setValidity('is_valid', false);
                            return null;
                        } else if (value == 0) {
                            ngModel.$setValidity('is_valid', undefined);
                            return null;
                        } else {
                            ngModel.$setValidity('is_valid', true);
                        }
                        return value;
                    }
                });
                ngModel.$formatters.push(function (value) {
                    value = parseFloat(value);
                    if (value) {
                        if (value > 100 || value < 0) {
                            return null;
                        } else {
                            ngModel.$setValidity('is_valid', true);
                        }
                        return value;
                    }
                });
            }
        }
    })
    .directive('dlProductsGrid',
        function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    title: '=',
                    description: '=?',
                    source: '=?',
                    page: '=?',
                    noProductsMessage: '=?'
                },
                templateUrl: 'app/components/views/products/products-grid.view.html',
                controller: 'ProductsGridController'
            }
        })
    .directive('dlProduct', ['$rootScope', '$location', 'ActiveSession', 'Product', 'ProductPhotos', 'DealerPhotos',
        function ($rootScope, $location, ActiveSession, Product, ProductPhotos, DealerPhotos) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    product: '='
                },
                templateUrl: 'app/components/views/products/product-cell.view.html',
                link: function (scope, element) {

                    var DEFAULT_PHOTO_RATIO = 0.678125;
                    var LOADING_STATUS = "loading";
                    var DOWNLOADED_STATUS = "downloaded";
                    var product = scope.product;

                    // Product Photo
                    scope.hasPhoto = product.photo1.length > 2;

                    scope.dealerProfile = function (event) {
                        $location.path("dealers/" + product.dealer.id);
                    };

                    var ratio = DEFAULT_PHOTO_RATIO;
                    if (product.main_photo_width && product.main_photo_height) {
                        ratio = product.main_photo_height / product.main_photo_width;
                    }

                    var imageContainer = $(element).find(".md-card-image-container");
                    if (scope.hasPhoto) {

                        var currentWidth = element.width();
                        var imageHeight = ratio * currentWidth;
                        var heightString = String(imageHeight) + "px";
                        imageContainer.css("height", heightString);

                        if (product.main_photo) {
                            scope.productImage = product.main_photo;
                            scope.productImageStatus = DOWNLOADED_STATUS;
                            imageContainer.removeAttr("style");
                        } else {
                            ProductPhotos.downloadPhoto(product.photo1, product.id);
                            scope.productImageStatus = LOADING_STATUS;
                        }
                    } else {
                        scope.imageBackgroundColor = ProductPhotos.colorForNum(product.photo1);
                    }
                    scope.$on('downloaded-photo-' + product.id, function (event, args) {
                        if (args.success) {
                            scope.productImage = args.data.url;
                            product.main_photo = scope.productImage;
                            scope.productImageStatus = DOWNLOADED_STATUS;
                            imageContainer.removeAttr("style");
                            scope.$apply();
                        } else {
                            console.log(args.data.message);
                        }
                    });

                    // Dealer Photo
                    scope.hasProfilePic = DealerPhotos.hasProfilePic(scope.product.dealer.photo);
                    var sender = 'products-grid';
                    if (scope.hasProfilePic) {

                        if (product.dealer.profilePic) {
                            scope.profilePic = product.dealer.profilePic;
                            scope.profilePicStatus = DOWNLOADED_STATUS;
                        } else {
                            scope.profilePic = "";
                            DealerPhotos.getPhoto(scope.product.dealer.photo, scope.product.dealer.id, sender);
                            scope.profilePicStatus = LOADING_STATUS;
                        }

                    } else {
                        scope.profilePic = DealerPhotos
                    }
                    scope.$on('downloaded-' + sender + '-dealer-pic-' + scope.product.dealer.id, function (event, args) {
                        if (args.success) {
                            scope.profilePic = args.data;
                            product.dealer.profilePic = scope.profilePic;
                            scope.profilePicStatus = DOWNLOADED_STATUS;
                            scope.$apply();
                        } else {
                            console.log(args.message);
                        }
                    });

                    // Other info
                    scope.discountTypePP = product.discount_type === "123";
                    scope.hasLikes = product.dealattribs.dealers_that_liked.length > 0;

                    scope.viewDeal = function (product) {
                        /**
                         * Takes the user to the product's View Deal page.
                         */
                        ActiveSession.setTempData("PRODUCT", product);
                        $location.path('/products/' + String(product.id));
                    };
                }
            };
        }]);