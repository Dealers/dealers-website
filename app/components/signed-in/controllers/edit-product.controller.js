(function () {
    'use strict';

    angular.module('DealersApp')

        /**
         * The controller that manages the second step of the Add Product Procedure.
         */
        .controller('EditProductController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdToast', '$routeParams', '$timeout', 'Product', 'ProductPhotos', 'EditProduct',
            function ($scope, $rootScope, $location, $mdDialog, $mdToast, $routeParams, $timeout, Product, ProductPhotos, EditProduct) {

                var SHEKEL = '₪';
                var DOLLAR = '$';
                var EURO = '€';
                var PERCENTAGE = '%';
                var PREV_PRICE = '123';
                var CONFIRM_EXIT_MESSAGE = "The changes you made will be lost.";
                var BASIC_INFO_PATH = "/new-product/basic-info";
                var VIEW_PRODUCT_PATH = "/products/" + $routeParams.productID + "/";
                var LOADING_MESSAGE = "Saving changes...";
                var BROADCASTING_PREFIX = 'photos-downloaded-for-';
                var UPLOAD_STARTED_MESSAGE = 'ep-upload-started';
                var UPLOAD_FINISHED_MESSAGE = 'ep-upload-finished';
                var EP_SESSION = 'epSession';
                var DONE_UPLOAD_MESSAGE = "Changes Saved!";
                var PRODUCT_URL = $rootScope.baseUrl + '/alldeals/' + $routeParams.productID + '/';

                $scope.originalDealer = {}; // The product without the changes that were taken place in this Edit Product session.
                $scope.product = {};
                $scope.currency = SHEKEL;
                $scope.discountType = PERCENTAGE;
                $scope.category = "";
                $scope.minDate = new Date();
                $scope.changedPhotos = false;
                $scope.savedChanges = false;

                $scope.photos = [];
                $scope.photosStatus = [];
                $scope.photosURLs = [];
                $scope.oldPhotosURLs = []; // If the photos array is changed, all the old photos are deleted, so this array keeps the old photos that should be deleted.
                $scope.selectedIndex = 0;
                $scope.addPhotoText = "Add a Photo";

                $scope.selectPhoto = selectPhoto;
                $scope.changeThumbnailSelection = changeThumbnailSelection;
                $scope.checkIfActive = checkIfActive;

                if (EditProduct.product.id) {
                    setProductInView(EditProduct.product);
                } else {
                    $scope.status = 'loading';
                    downloadProduct();
                    loadPhotos();
                }

                function downloadProduct() {
                    var productID = $routeParams.productID;
                    Product.getProduct(productID)
                        .then(function (result) {
                            setProductInView(result.data);
                        }, function (httpError) {
                            $scope.status = 'failed';
                            $scope.errorMessage = "Couldn't download the product";
                            $scope.errorPrompt = "Please try again...";
                        });
                }

                /**
                 * Sets the view to present the product.
                 * @param product - the product.
                 */
                function setProductInView(product) {
                    if (product) {
                        $scope.status = 'downloaded';
                        $scope.originalDealer = Product.mapData(product);
                        $scope.product = $.extend({}, $scope.originalDealer);
                        fillOptionMenus();
                        setProductPhotos();
                    } else {
                        console.log("Something is wrong - setProductInView called but there's no product!");
                    }
                }

                /**
                 * Checks if there are photos in the current product object, and if so loads them into the scope's photos array.
                 */
                function loadPhotos() {
                    if ($scope.product) {
                        if ($scope.product.photos) {
                            if ($scope.product.photos.length > 0) {
                                $scope.photos = $scope.product.photos;
                                var indexesToDelete = [];
                                for (var i = 0; i < $scope.photos.length; i++) {
                                    if (!Photos.checkIfImageData($scope.photos[i])) {
                                        indexesToDelete.push(i);
                                    }
                                }
                                for (i = 0; i < indexesToDelete.length; i++) {
                                    $scope.photos.splice(indexesToDelete[i], 1);
                                }
                                $scope.photosURLs = Photos.imageDataToUrls($scope.photos);
                                $scope.selectPhoto(0);
                            }
                        }
                    }
                }

                /**
                 * Takes care of presenting the photos if exists, and handle it gracefully if not.
                 */
                function setProductPhotos() {
                    ProductPhotos.downloadPhotos($scope.product);
                    for (var i = 0; i < ProductPhotos.photosNum($scope.product); i++) {
                        $scope.photosStatus.push("loading");
                        $scope.photosURLs.push($rootScope.DEFAULT_PRODUCT_PHOTO_URL);
                    }
                    $scope.selectPhoto(0);
                    $scope.$on('downloaded-photo-' + $scope.product.id, function (event, args) {
                        var data = args.data;
                        var index = data.photoIndex - 1;
                        if (args.success) {
                            $scope.photos[index] = data.rawImage;
                            $scope.photosURLs[index] = data.url;
                            $scope.photosStatus[index] = "doneLoading";
                            $scope.$apply();
                        } else {
                            console.log("Photos number " + data.photoIndex + " failed to download: \n" + data.message);
                            $scope.photosStatus[index] = "failed";
                        }
                    });
                }

                /**
                 * Sets the option menus according to the current product.
                 */
                function fillOptionMenus() {
                    var product = $scope.product;
                    if (product) {
                        $scope.currency = product.currency;
                        if (product.discount_type) {
                            $scope.discountType = product.discount_type;
                        }
                        $scope.category = product.category;
                    }
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
                    var photosNum = $scope.photos.length;
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

                /**
                 * Asks the user to confirm he wants to remove the photo, and if he does, removes the photo.
                 * @param event - the event that triggerd the function.
                 */
                $scope.removePhoto = function (event) {
                    var confirm = $mdDialog.confirm()
                        .title('Remove Photo')
                        .textContent('Are you sure you want to remove this photo?')
                        .ariaLabel('Remove photo')
                        .targetEvent(event)
                        .ok('Yes')
                        .cancel('Cancel');
                    $mdDialog.show(confirm).then(function () {
                        var photoIndex = event.target.parentElement.parentElement.id;
                        photoIndex = parseInt(photoIndex, 10);
                        $scope.photos.splice(photoIndex, 1);
                        $scope.photosURLs.splice(photoIndex, 1);
                        $scope.changedPhotos = true;
                    });
                };

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

                /**
                 * Opens an angular-material dropdown menu.
                 * @param $mdOpenMenu - the menu to open.
                 * @param ev - the event that triggered the function.
                 */
                $scope.openMenu = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                /**
                 * Changes the status of the changedPhotos variable to true.
                 * @param ev - the event argument.
                 */
                $scope.changedPhoto = function (ev) {
                    $scope.changedPhotos = true;
                };

                /**
                 * Change the selected currency to SHEKEL.
                 */
                $scope.shekel = function () {
                    $scope.currency = SHEKEL;
                };

                /**
                 * Change the selected currency to DOLLAR.
                 */
                $scope.dollar = function () {
                    $scope.currency = DOLLAR;
                };

                /**
                 * Change the selected currency to EURO.
                 */
                $scope.euro = function () {
                    $scope.currency = EURO;
                };

                /**
                 * Change the selected discount type to PERCENTAGE.
                 */
                $scope.percentage = function () {
                    $scope.discountType = PERCENTAGE;
                };

                /**
                 * Change the selected discount type to PREV_PRICE.
                 */
                $scope.prevPrice = function () {
                    $scope.discountType = PREV_PRICE;
                };

                /**
                 * Presents the loading dialog.
                 * @param ev - the event that triggered the loading.
                 */
                function showLoadingDialog(ev) {
                    $mdDialog.show({
                        templateUrl: 'app/components/general/loading-dialog.view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        controller: 'LoadingDialogController',
                        locals: {message: LOADING_MESSAGE},
                        escapeToClose: false
                    });
                }

                /**
                 * Hides the loading dialog.
                 * @param ev - the event that triggered the hiding.
                 */
                function hideLoadingDialog(ev) {
                    $mdDialog.hide();
                }

                /**
                 * Being called when the product started to be uploaded to the server.
                 */
                $scope.$on(UPLOAD_STARTED_MESSAGE, function (event) {
                    showLoadingDialog(event);
                });

                /**
                 * Being called when the product finished to be uploaded, whether successfully or unsuccessfully.
                 */
                $scope.$on(UPLOAD_FINISHED_MESSAGE, function (event, args) {
                    hideLoadingDialog();
                    if (args.success) {
                        $scope.savedChanges = true;
                        $location.path(VIEW_PRODUCT_PATH);
                        $timeout($rootScope.showToast, 1500, true, DONE_UPLOAD_MESSAGE);
                    } else {
                        console.log(args.message);
                        showAlertDialog("We're sorry, but there was a problem", args.message, event);
                    }
                });
                
                /**
                 * Submits the new product object to the server.
                 * @param form - the form.
                 */
                $scope.submitEdit = function (form) {
                    $scope.product.photos = $scope.photos;
                    $scope.product.currency = $scope.currency;
                    if ($scope.product.discount_value) {
                        $scope.product.discount_type = $scope.discountType;
                    }
                    // See if there were any changes
                    if ($scope.changedPhotos || !Product.areEqual($scope.originalDealer, $scope.product)) {
                        // There were changes, validate and upload them to the server.
                        if (!validation(form, event)) {
                            return;
                        }
                        showLoadingDialog();
                        // If there were changes in the photos, then upload the changes and wait for the message
                        // that indicates that the upload is finished. If not, then just upload the product object.
                        if ($scope.changedPhotos) {
                            $scope.oldPhotosURLs = ProductPhotos.setProductPhotosInArray($scope.product);
                            ProductPhotos.uploadPhotosOfProduct($scope.product, EP_SESSION);
                        } else {
                            EditProduct.uploadModifiedProduct($scope.product);
                        }
                    } else {
                        $location.path(VIEW_PRODUCT_PATH);
                    }
                };

                $scope.$on(BROADCASTING_PREFIX + EP_SESSION, function (event, args) {
                    var data = args.data;
                    if (args.success) {
                        // Finished uploading photos, start uploading the product's data, and in the meantime delete the old photos form the s3.
                        $scope.product = args.product;
                        EditProduct.uploadModifiedProduct($scope.product);
                        if ($scope.oldPhotosURLs) {
                            ProductPhotos.deletePhotos($scope.oldPhotosURLs);
                        }
                    } else {
                        hideLoadingDialog(event);
                        console.log("Couldn't upload the photos. Aborting upload process.");
                    }
                });

                /**
                 * Validates that all the required fields were filled and that everything is valid.
                 * @param form - the form that was filled.
                 * @param event - the event that triggered the submission.
                 * @returns {boolean} - true if valid, else false.
                 */
                function validation(form, event) {
                    if ($scope.photos.length == 0) {
                        showAlertDialog("Missing Photos", "You must add photos of your product!", event);
                        return false;
                    }
                    if (!$scope.product.title) {
                        showAlertDialog("Title Is Blank", "You must add a title for you product!", event);
                        return false;
                    }
                    if ($scope.product.price == null) {
                        showAlertDialog("Blank Price", "Please add the price of your product!", event);
                        return false;
                    }
                    if ($scope.product.price <= 0) {
                        showAlertDialog("Not a Valid Price", "Please enter a valid price.", event);
                        return false;
                    }
                    if ($scope.product.discount_value < 0) {
                        showAlertDialog("Not a Valid Discount", "Please enter a valid discount (not required).", event);
                        return false;
                    }
                    if ($scope.product.discount_value > 100 && $scope.discountType == PERCENTAGE) {
                        showAlertDialog("Not a Valid Discount", "You entered a discount of more than 100%!", event);
                        return false;
                    }
                    if ($scope.product.category != null) {
                        if ($scope.product.category.length == 0) {
                            showAlertDialog("Blank Category", "Please add a category to which your product relates.", event);
                            return false;
                        }
                    } else {
                        showAlertDialog("Blank Category", "Please add a category to which your product relates.", event);
                        return false;
                    }
                    if (form.expirationDate.$invalid) {
                        showAlertDialog("Not a Valid Date", "Please enter a valid expiration date (not required).", event);
                        return false;
                    }

                    return true;
                }

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

                window.onbeforeunload = function () {
                    return CONFIRM_EXIT_MESSAGE;
                };

                /**
                 * Asks the user to confirm he wants to leave the Add Product process, explaining that it will cause the lost
                 * of the data he entered.
                 * @type {*|(function())}
                 */
                $scope.$on('$locationChangeStart', function (event, next) {
                    if (($scope.changedPhotos || !Product.areEqual($scope.originalDealer, $scope.product)) && !$scope.savedChanges) {
                        var answer = confirm("Are you sure you want to leave this page? The changes will be lost.");
                        if (!answer) {
                            event.preventDefault();
                        }
                    }
                });

                $scope.$on('$destroy', function () {
                    window.onbeforeunload = null;
                    // $locationChangeStartUnbind();
                });
            }]);
})();