(function () {
    'use strict';

    angular.module('DealersApp')
        .controller('ViewDealController',
            ['$scope', '$rootScope', '$http', '$routeParams', '$location', '$timeout', '$mdDialog', 'Product', 'ProductPhotos', 'DealerPhotos', 'ActiveSession', 'EditProduct',
                function ($scope, $rootScope, $http, $routeParams, $location, $timeout, $mdDialog, Product, ProductPhotos, DealerPhotos, ActiveSession, EditProduct) {

                    var ctrl = this;

                    var PRODUCT_URL = $rootScope.baseUrl + '/alldeals/' + $routeParams.productID + '/';
                    var PRODUCT_PAGE_BASE_URL = $rootScope.baseUrl + '/products/';


                    $scope.product = {};
                    $scope.status = 'loading';
                    $scope.productPhotosStatus = [];
                    $scope.photosURLs = [];
                    $scope.profilePicStatus = 'loading';
                    $scope.hasProfilePic = false;
                    $scope.user = $rootScope.dealer;
                    $scope.discountTypePP = "";
                    $scope.totalLikes = 0;
                    $scope.firstPhotoSelected = false;

                    $scope.userProfilePic = null;
                    $scope.commentPlaceholder = "";
                    $scope.comment = {};
                    $scope.showCommentError = false;
                    $scope.commentErrorMessage = "Oops! Comment can't be blank!";
                    $scope.showCommentButton = false;

                    $scope.selectPhoto = selectPhoto;
                    $scope.changeThumbnailSelection = changeThumbnailSelection;
                    $scope.checkIfActive = checkIfActive;
                    $scope.addComment = addComment;
                    $scope.presentCommentError = presentCommentError;


                    $scope.product = ActiveSession.getTempData("PRODUCT"); // Retrieves the product from the Active Session service.
                    if (!$scope.product) {
                        // There is no product in the session, download it form the server.
                        downloadProduct();
                    } else {
                        $scope.status = 'downloaded';
                        fillData();
                    }

                    function downloadProduct() {
                        var productID = $routeParams.productID;
                        Product.getProduct(productID)
                            .then(function (result) {
                                $scope.status = 'downloaded';
                                $scope.product = result.data;
                                $scope.product = Product.mapData($scope.product);
                                fillData();
                            }, function (httpError) {
                                $scope.status = 'failed';
                                $scope.errorMessage = "Couldn't download the product";
                                $scope.errorPrompt = "Please try again...";
                            });
                    }

                    /**
                     * Injects the product's data into the view.
                     */
                    function fillData() {
                        setProductPhotos();
                        setDealerProfile();

                        $scope.firstPhotoHeight = $scope.product.main_photo_height;
                        $scope.discountTypePP = $scope.product.discount_type === "123";
                        $scope.totalLikes = $scope.product.dealattribs.dealers_that_liked.length;

                        // Comments (only if the user has a dealer object, meaning he's signed in)
                        if ($scope.user) {
                            if (!$rootScope.userProfilePic) {
                                waitForProfilePic();
                            } else {
                                $scope.userProfilePic = $rootScope.userProfilePic;
                            }
                            if ($scope.product.comments.length > 1) {
                                $scope.commentPlaceholder = "Add a comment...";
                            } else {
                                $scope.commentPlaceholder = "Be the first to comment...";
                            }
                        }
                    }

                    /**
                     * Takes care of presenting the photos in the carousel.
                     */
                    function setProductPhotos() {
                        ProductPhotos.downloadPhotos($scope.product);
                        for (var i = 0; i < ProductPhotos.photosNum($scope.product); i++) {
                            $scope.productPhotosStatus.push("loading");
                            $scope.photosURLs.push($rootScope.DEFAULT_PRODUCT_PHOTO_URL);
                        }
                        $scope.$on('downloaded-photo-' + $scope.product.id, function (event, args) {
                            var data = args.data;
                            var index = data.photoIndex - 1;
                            if (args.success) {
                                $scope.photosURLs[index] = data.url;
                                $scope.productPhotosStatus[index] = "doneLoading";
                                if (!$scope.firstPhotoSelected) {
                                    $scope.selectPhoto(0);
                                    $scope.firstPhotoSelected = true;
                                }
                                $scope.$apply();
                            } else {
                                console.log("Photos number " + data.photoIndex + " failed to download: \n" + data.message);
                                $scope.productPhotosStatus[index] = "failed";
                            }
                        });
                    }

                    /**
                     * Changes the presented photo in the photo container.
                     * @param index - the index of the new selected photo.
                     */
                    function selectPhoto(index) {
                        $scope.selectedIndex = index;
                        $scope.changeThumbnailSelection(index);
                        $timeout(function () {
                            $('.carousel-inner div').each(function (i) {
                                if ($scope.selectedIndex == i) {
                                    $(this).addClass("active");
                                } else {
                                    $(this).removeClass("active");
                                }
                            });
                        }, 100);
                    }

                    /**
                     * Checks if the photo element in the received index has the 'active' class.
                     * @param index - the index of the photo element.
                     * @returns {boolean} - True if the photo element has the 'active' class, false otherwise.
                     */
                    function checkIfActive(index) {
                        var carousel = $("div.carousel-inner");
                        var photos = carousel.children();
                        return $(photos[index]).hasClass("active");
                    }

                    /**
                     * Changes the selection mark to the photo thumbnail with the received index.
                     * @param index - the index of the new selected thumbnail.
                     */
                    function changeThumbnailSelection(index) {
                        $('button.ap-thumbnail').removeClass('selected');
                        $('li#' + index + " button.ap-thumbnail").addClass('selected');
                    }

                    /**
                     * The bootstrap carousel chevron button was clicked. Checks which chevron button was clicked, left or right,
                     * and changes the selected photo accordingly.
                     */
                    $scope.nextPhoto = function (event) {
                        var chevronButton;
                        if (event.target.tagName == "A") {
                            // The anchor tag was clicked, set it as the chevron button.
                            chevronButton = event.target;
                        } else {
                            // The span tag was clicked, the anchor tag child. Get its parent (the anchor tag).
                            chevronButton = event.target.parentElement;
                        }
                        var photosNum = $scope.photosURLs.length;
                        var index;

                        if (!$scope.checkIfActive($scope.selectedIndex)) {
                            // The current photo doesn't have the 'active' class yet, which means the slide animation isn't finished
                            // yet.
                            return;
                        }

                        if ($(chevronButton).hasClass("left")) {
                            index = $scope.selectedIndex - 1;
                            if (index < 0) {
                                index = photosNum - 1;
                            }
                        } else if ($(chevronButton).hasClass("right")) {
                            index = $scope.selectedIndex + 1;
                            if (index >= photosNum) {
                                index = 0;
                            }
                        }
                        $scope.selectedIndex = index;
                        $scope.changeThumbnailSelection(index);
                    };

                    $scope.$watchGroup(
                        ["photos[0]", "photos[1]", "photos[2]", "photos[3]"],
                        function handleImageChange(newValue, oldValue) {
                            for (var i = 0; i < newValue.length; i++) {
                                if (newValue[i] != null && oldValue[i] == null) {
                                    // A new photo was added at the index <i>. Set it in the main image view.
                                    $scope.selectPhoto(i);
                                }
                            }
                        }
                    );

                    function setDealerProfile() {
                        /*
                         * Arranges the dealer's profile section.
                         */
                        var photo = $scope.product.dealer.photo;
                        var sender = 'view-deal';
                        $scope.hasProfilePic = DealerPhotos.hasProfilePic(photo);
                        if ($scope.hasProfilePic) {
                            $scope.profilePic = "";
                            DealerPhotos.getPhoto(photo, $scope.product.dealer.id, sender);
                            $scope.profilePicStatus = "loading";
                        }
                        $scope.$on('downloaded-' + sender + '-profile-pic-' + $scope.product.dealer.id, function (event, args) {
                            if (args.success) {
                                $scope.profilePic = args.data;
                                $scope.profilePicStatus = "doneLoading";
                            } else {
                                console.log(args.message);
                                $scope.profilePicStatus = "failed";
                            }
                        });
                    }

                    function waitForProfilePic() {
                        $scope.$on('downloaded-' + $rootScope.userProfilePicSender + '-profile-pic-' + $scope.product.dealer.id, function (event, args) {
                            if (args.success) {
                                $scope.userProfilePic = args.data;
                            } else {
                                $scope.userProfilePic = null;
                                console.log(args.message);
                            }
                        });
                    }

                    $scope.canEdit = function() {
                        if ($scope.user) {
                            if ($scope.product.dealer.id == $rootScope.dealer.id) {
                                return true;
                            }
                        }
                        return false;
                    };

                    $scope.editProduct = function() {
                        if ($scope.canEdit()) {
                            EditProduct.product = $scope.product;
                            $location.path("edit-product/" + $scope.product.id);
                        }
                    };

                    /**
                     * Opens an angular-material dropdown menu.
                     * @param $mdOpenMenu - the menu to open.
                     * @param ev - the event that triggered the function.
                     */
                    $scope.openMenu = function ($mdOpenMenu, ev) {
                        $mdOpenMenu(ev);
                    };

                    $scope.report = function(event) {
                        console.log("Report!");
                    };

                    /**
                     * Asks the user to confirm he wants to delete the product.
                     * @param event - the event that triggered the function.
                     */
                    $scope.deleteProduct = function (event) {
                        var confirm = $mdDialog.confirm()
                            .title('Delete Product')
                            .textContent('Are you absolutely sure that you want to delete this product? It cannot be undone!')
                            .ariaLabel('Delete product')
                            .targetEvent(event)
                            .ok('Yes, delete this product')
                            .cancel('Cancel');
                        $mdDialog.show(confirm).then(function () {
                            Product.deleteProduct(PRODUCT_URL)
                                .then(function (response) {
                                        // success
                                        console.log("Product deleted successfully.");
                                        $timeout($rootScope.showToast, 1000, true, "Deleted the product.");
                                        $location.path("/home");
                                    },
                                    function (httpError) {
                                        // error
                                        console.log(httpError.status + " : " + httpError.data);
                                        $mdDialog.show(
                                            $mdDialog.alert()
                                                .parent(angular.element(document.body))
                                                .clickOutsideToClose(true)
                                                .title("Couldn't delete the product")
                                                .textContent("Please try again!")
                                                .ariaLabel('Alert Dialog')
                                                .ok("OK")
                                                .targetEvent(ev)
                                        );
                                    });
                        });
                    };

                    function addComment(form) {
                        if (!form.$valid) {
                            $scope.presentCommentError();
                        } else {
                            var comment = $scope.comment;
                            comment.upload_date = new Date();
                            comment.product = $scope.product.id;
                            comment.dealer = $rootScope.dealer.id;
                            comment.type = "Deal";
                            $scope.showCommentError = false;
                            $http.post($rootScope.baseUrl + '/addcomments/', comment)
                                .then(function (response) {
                                        // success
                                        console.log("Comment uploaded successfully!");
                                        comment = response.data;
                                        comment.dealer = $rootScope.dealer;
                                        $scope.product.comments.push(comment);
                                        $scope.comment = {};
                                    },
                                    function (httpError) {
                                        // error
                                        console.log(httpError.status + " : " + httpError.data);
                                        $scope.showCommmentError = true;
                                        $scope.presentCommentError("There was an error, please try again");
                                    });
                        }
                    }

                    function presentCommentError(errorMessage) {
                        /*
                         * Present an error message above the comment textarea.
                         */
                        if (errorMessage) {
                            $scope.commentErrorMessage = errorMessage;
                        } else {
                            $scope.commentErrorMessage = "There was an error, please try again";
                        }
                        $scope.showCommentError = true;
                    }
                }]);
})();