angular.module('DealersApp')
    .controller('ViewDealController',
        ['$scope', '$rootScope', '$http', '$routeParams', '$route', '$location', '$timeout', '$mdDialog', '$mdMedia', 'Product', 'ProductPhotos', 'DealerPhotos', 'ActiveSession', 'EditProduct', 'Dialogs', 'Checkout',
            function ($scope, $rootScope, $http, $routeParams, $route, $location, $timeout, $mdDialog, $mdMedia, Product, ProductPhotos, DealerPhotos, ActiveSession, EditProduct, Dialogs, Checkout) {

                var ctrl = this;

                var PRODUCT_URL = $rootScope.baseUrl + '/alldeals/' + $routeParams.productID + '/';
                var PRODUCT_PAGE_BASE_URL = $rootScope.baseUrl + '/products/';
                var BUY_FUNCTION_REPR = "buyClicked";
                var PRODUCT_AS_KEY = "PRODUCT";

                $scope.product = {};
                $scope.status = 'loading';
                $scope.productPhotosStatus = [];
                $scope.photosURLs = [];
                $scope.profilePicStatus = 'loading';
                $scope.hasProfilePic = false;
                $scope.variants = [];
                $scope.purchase = {
                    selections: [],
                    quantity: 1
                };
                $scope.user = $rootScope.dealer;
                $scope.totalLikes = 0;
                $scope.firstPhotoSelected = false;
                $scope.movedToCheckout = false;

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
                $scope.proceedToCheckout = proceedToCheckout;
                $scope.showAlertDialog = showAlertDialog;

                $scope.$watch(function () {
                    return $mdMedia('gt-sm');
                }, function (big) {
                    $scope.bigScreen = big;
                });

                $scope.product = ActiveSession.getTempData(PRODUCT_AS_KEY); // Retrieves the product from the Active Session service.
                if (!$scope.product || EditProduct.isAfterEdit) {
                    // There is no product in the session, or the is not an updated one. Download it form the server.
                    downloadProduct();
                    EditProduct.isAfterEdit = false;
                } else if ($scope.product.id != $routeParams.productID) {
                    downloadProduct();
                } else {
                    $scope.status = 'downloaded';

                    // Check if should go to the checkout view (in case the user signed up in order to buy the product).
                    if (ActiveSession.shouldRunAction(BUY_FUNCTION_REPR)) {
                        proceedToCheckout();
                    }

                    fillData();
                }

                function downloadProduct() {
                    var productID = $routeParams.productID;
                    Product.getProduct(productID)
                        .then(function (result) {
                            $scope.status = 'downloaded';
                            $scope.product = result.data;
                            $scope.product = Product.mapData($scope.product);

                            // Check if should go to the checkout view (in case the user signed up in order to buy the product).
                            if (ActiveSession.shouldRunAction(BUY_FUNCTION_REPR)) {
                                proceedToCheckout();
                            }

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
                    $scope.variants = Product.parseVariantsFromServer($scope.product.variants);
                    $scope.totalLikes = $scope.product.dealattribs.dealers_that_liked.length;

                    // Comments (only if the user has a dealer object, meaning he's signed in)
                    if ($scope.user) {
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
                    $('div.ap-thumbnail').removeClass('selected');
                    $('li#' + index + " div.ap-thumbnail").addClass('selected');
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
                     * Arranges the dealer's dealer section.
                     */
                    var photo = $scope.product.dealer.photo;
                    var sender = 'view-deal';
                    $scope.hasProfilePic = DealerPhotos.hasProfilePic(photo);
                    if ($scope.hasProfilePic) {
                        $scope.profilePic = "";
                        DealerPhotos.getPhoto(photo, $scope.product.dealer.id, sender);
                        $scope.profilePicStatus = "loading";
                    }
                    $scope.$on('downloaded-' + sender + '-dealer-pic-' + $scope.product.dealer.id, function (event, args) {
                        if (args.success) {
                            $scope.profilePic = args.data;
                            $scope.profilePicStatus = "doneLoading";
                        } else {
                            console.log(args.message);
                            $scope.profilePicStatus = "failed";
                        }
                    });
                }

                $scope.canEdit = function () {
                    if ($scope.user) {
                        if ($scope.product.dealer.id == $rootScope.dealer.id) {
                            return true;
                        }
                    }
                    return false;
                };

                $scope.editProduct = function () {
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

                $scope.report = function (event) {
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

                /**
                 * Presents the alert dialog when there is an invalid field.
                 * @param title - the title of the alert dialog.
                 * @param content - the content of the alert dialog.
                 * @param ev - the event that triggered the alert.
                 */
                function showAlertDialog(title, content, ev) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title(title)
                            .textContent(content)
                            .ariaLabel('Alert Dialog')
                            .ok("Got it")
                            .targetEvent(ev)
                    );
                }

                function validation() {

                    // First check that the user is signed in
                    if (!$rootScope.dealer) {
                        // The user is not signed in, present the Sign In dialog and quit this function.
                        Dialogs.showSignInDialog(event, 0, true)
                            .then(function (finished) {
                                // Reinstantiate the page after adding the buyClicked function to the Actions To Run stack
                                ActiveSession.addActionToRun(BUY_FUNCTION_REPR);
                                $route.reload();
                            });
                        return false;

                    }

                    for (var property in $scope.variants) {
                        if ($scope.variants.hasOwnProperty(property)) {
                            var variant = $scope.variants[property];
                            if (!variant.selection) {
                                showAlertDialog(
                                    "",
                                    "Please select a " + variant.name.toLowerCase() + ".");
                                return false;
                            }
                            $scope.purchase.selections.push({
                                name: variant.name,
                                selection: variant.selection
                            });
                        }
                    }

                    if (!($scope.purchase.quantity > 0)) {
                        showAlertDialog(
                            "",
                            "Please select a valid quantity.");
                        return false;
                    }

                    if ($scope.purchase.quantity > $scope.product.max_quantity) {
                        showAlertDialog(
                            "",
                            "The maximum quantity for order is " + $scope.product.max_quantity + ".");
                        return false;
                    }

                    $scope.purchase.quantity = Math.round($scope.purchase.quantity);

                    return true;
                }

                /**
                 * Takes the user to the checkout view after clicking the buy button.
                 */
                function proceedToCheckout() {

                    if (!validation()) {
                        return;
                    }

                    $scope.product.photo = $scope.photosURLs ? $scope.photosURLs[0] : null;
                    ActiveSession.setTempData(PRODUCT_AS_KEY, $scope.product);
                    Checkout.purchase = $scope.purchase;
                    $scope.movedToCheckout = true;
                    var path = "/products/" + $scope.product.id + "/checkout";
                    $location.path(path);
                }

                $scope.$on('$destroy', function () {
                    if (!$scope.movedToCheckout) {
                        ActiveSession.removeTempData(PRODUCT_AS_KEY);
                    }
                })
            }]);