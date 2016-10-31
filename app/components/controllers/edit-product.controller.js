angular.module('DealersApp')

/**
 * The controller that manages the second step of the Add Product Procedure.
 */
    .controller('EditProductController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdConstant', '$mdToast', '$routeParams', '$timeout', 'Product', 'ProductPhotos', 'EditProduct', 'ShippingMethods', 'Dialogs', 'Translations',
        function ($scope, $rootScope, $location, $mdDialog, $mdConstant, $mdToast, $routeParams, $timeout, Product, ProductPhotos, EditProduct, ShippingMethods, Dialogs, Translations) {

            var SHEKEL = '₪';
            var DOLLAR = '$';
            var EURO = '€';
            var PERCENTAGE = '%';
            var CONFIRM_EXIT_MESSAGE = "The changes you made will be lost.";
            var VIEW_PRODUCT_PATH = "/products/" + $routeParams.productID + "/";
            var LOADING_MESSAGE = "Saving changes...";
            var BROADCASTING_PREFIX = 'photos-downloaded-for-';
            var UPLOAD_STARTED_MESSAGE = 'ep-upload-started';
            var UPLOAD_FINISHED_MESSAGE = 'ep-upload-finished';
            var EP_SESSION = 'epSession';
            var DONE_UPLOAD_MESSAGE = "Changes Saved!";
            var PRODUCT_URL = $rootScope.baseUrl + '/alldeals/' + $routeParams.productID + '/';

            $scope.DEALERS_SHIPPING_PRICE = ShippingMethods.DEALERS_SHIPPING_PRICE;
            $scope.DEALERS_SHIPPING_ETD = ShippingMethods.DEALERS_SHIPPING_ETD;
            $scope.DEALERS_SHIPPING_DESCRIPTION = ShippingMethods.DEALERS_SHIPPING_DESCRIPTION;
            $scope.originalDealer = {}; // The product without the changes that were taken place in this Edit Product session.
            $scope.product = {};
            $scope.translations = {}; // Translations that should be inserted in the scope for presentations in the view.
            $scope.currency = SHEKEL;
            $scope.discountType = PERCENTAGE;
            $scope.category = "";
            $scope.minDate = new Date();
            $scope.changedPhotos = false;
            $scope.savedChanges = false;
            $scope.downloadedFromServer = false;

            $scope.photos = [];
            $scope.photosStatus = [];
            $scope.photosURLs = [];
            $scope.oldPhotosURLs = []; // If the photos array is changed, all the old photos are deleted, so this array keeps the old photos that should be deleted.
            $scope.selectedIndex = 0;

            $scope.variants = {};
            $scope.maxVariants = 3;
            $scope.variations = [];
            $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.TAB];

            $scope.selectPhoto = selectPhoto;
            $scope.changeThumbnailSelection = changeThumbnailSelection;
            $scope.checkIfActive = checkIfActive;
            $scope.changePercentageOff = changePercentageOff;
            $scope.changeOriginalPrice = changeOriginalPrice;
            $scope.setProductInView = setProductInView;

            if (EditProduct.product.id) {
                loadScopeTranslations();
                setProduct(EditProduct.product);
                $scope.setProductInView();
                $scope.variants = Product.parseVariantsFromServer($scope.product.variants);
            } else {
                $scope.status = 'loading';
                downloadProduct();
                loadPhotos();
            }

            function downloadProduct() {
                var productID = $routeParams.productID;
                Product.getProduct(productID)
                    .then(function (result) {
                        $scope.downloadedFromServer = true;
                        var product = result.data;
                        product = Product.mapData(product);
                        loadScopeTranslations();
                        setProduct(product);
                        $scope.setProductInView();
                        $scope.variants = Product.parseVariantsFromServer($scope.product.variants);
                    }, function (httpError) {
                        $scope.status = 'failed';
                        $scope.errorMessage = "Couldn't download the product";
                        $scope.errorPrompt = "Please try again...";
                    });
            }

            function loadScopeTranslations() {
                $scope.translations.placeholderNames = Translations.productEdit.placeholderNames;
                $scope.translations.placeholderOptions = Translations.productEdit.placeholderOptions;
            }

            function setProduct(product) {
                if (product) {
                    $scope.status = 'downloaded';
                    $scope.product = $.extend(true, {}, product);
                    $scope.shipping_methods = ShippingMethods.parseShippingFromServer($scope.product, $scope.downloadedFromServer);
                    $scope.originalShippingMethods = $.extend(true, {}, $scope.shipping_methods);
                } else {
                    console.log("Something is wrong - setProduct called but there's no product!");
                }
            }

            $scope.changePrice = function (event) {
                if ($scope.product.percentage_off > 0) {
                    $scope.changePercentageOff(event);
                }
            };

            function changePercentageOff(event) {
                if ($scope.product.percentage_off) {
                    var margin = 100 - $scope.product.percentage_off;
                    if (margin <= 0) {
                        $scope.product.price = 0;
                        $scope.product.original_price = null;
                    } else {
                        $scope.product.original_price = ($scope.product.price / margin) * 100;
                    }
                }
            }

            function changeOriginalPrice(event) {
                var percentage_off = (1 - ($scope.product.price / $scope.product.original_price)) * 100;
                $scope.product.percentage_off = Math.round(percentage_off * 100) / 100; // Keep only 2 decimals.
            }

            /**
             * Sets the view to present the product.
             */
            function setProductInView() {
                $scope.presentPercentageOff = $scope.product.percentage_off ? true : false;
                $scope.presentOriginalPrice = $scope.product.original_price ? true : false;
                $scope.changePercentageOff();
                $scope.changeOriginalPrice();
                fillOptionMenus();
                setProductPhotos();
            }

            $scope.changePresentPercentageOff = function (event) {
                $scope.presentPercentageOff = !$scope.presentPercentageOff;
            };

            $scope.changePresentOriginalPrice = function (event) {
                $scope.presentOriginalPrice = !$scope.presentOriginalPrice;
            };

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
                    $scope.category = product.category;
                }
            }

            /**
             * Changes the presented photo in the photo container.
             * @param index - the index of the new selected photo.
             */
            function selectPhoto(index) {
                var loadTime;
                if ($scope.photosURLs.length == 1) {
                    loadTime = 500;
                } else {
                    loadTime = 50;
                }
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
                }, loadTime);
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
                $('li#' + index + "-photo div.ap-thumbnail").addClass('selected');
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
                $scope.selectPhoto(index);
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
                    .title(Translations.general.removePhotoTitle)
                    .textContent(Translations.general.removePhotoConfirm)
                    .ariaLabel('Remove photo')
                    .targetEvent(event)
                    .ok(Translations.general.approve)
                    .cancel(Translations.general.cancel);
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
                        .ok(Translations.general.gotIt)
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

            $scope.getVariantsLength = function () {
                return Object.keys($scope.variants).length;
            };

            /**
             * Adds another Variant field to the view.
             * @param event
             */
            $scope.addVariant = function (event) {
                if ($scope.getVariantsLength() < $scope.maxVariants) {
                    $scope.variants[$scope.getVariantsLength()] = {
                        name: "",
                        options: []
                    }
                }
            };

            /**
             * Removes the Variant field from the view.
             * @param index - the index of the Variant to remove.
             * @param event
             */
            $scope.removeVariant = function (index, event) {
                delete $scope.variants[index];
                while ($scope.variants[index + 1]) {
                    $scope.variants[index] = $scope.variants[index + 1];
                    delete $scope.variants[index + 1];
                    index++;
                }
            };

            /**
             * Presents the loading dialog.
             * @param ev - the event that triggered the loading.
             */
            function showLoadingDialog(ev) {
                $mdDialog.show({
                    templateUrl: 'app/components/views/loading-dialog.view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'LoadingDialogController',
                    locals: {message: Translations.general.saveChanges},
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
                    if (args.data) {
                        $scope.product = args.data;
                        $scope.product.variants = $scope.variantsForLater;
                        EditProduct.product = $scope.product;
                    }
                    EditProduct.isAfterEdit = true;
                    $location.path(VIEW_PRODUCT_PATH);
                    $timeout($rootScope.showToast, 1500, true, DONE_UPLOAD_MESSAGE);
                } else {
                    console.log(args.message);
                    showAlertDialog("We're sorry, but there was a problem", args.message, event);
                }
            });

            /**
             * Organizes the price and discount input before upload.
             */
            function preparePriceAndDiscount() {
                if ($scope.product.percentage_off && !$scope.presentPercentageOff) {
                    $scope.product.percentage_off = null;
                }
                if ($scope.product.original_price && !$scope.presentOriginalPrice) {
                    $scope.product.original_price = null;
                }
            }

            /**
             * Removes variants with empty names and also removes empty options.
             */
            function prepareVariants() {
                for (var property in $scope.variants) {
                    if ($scope.variants.hasOwnProperty(property)) {
                        var name = $scope.variants[property].name;
                        if (!(name.length > 0)) {
                            delete $scope.variants[property];
                            continue;
                        }
                        var options = $scope.variants[property].options;
                        for (var i = options.length - 1; i >= 0; i--) {
                            if (options[i].length == 0) {
                                options.splice(i, 1);
                            }
                        }
                    }
                }
            }

            /**
             * Update the variants in the server.
             */
            function updateVariants() {
                EditProduct.deleteVariants($scope.product.variants);
                delete $scope.product.variants;
                var variants = Product.parseVariantsToServer($scope.variants);
                var postedVariants = [];
                for (var i = 0; i < variants.length; i++) {
                    variants[i].deal = $scope.product.id;
                    EditProduct.postVariant(variants[i])
                        .then(function (result) {
                            postedVariants.push(result.data);
                            if (postedVariants.length == variants.length) {
                                $scope.variantsForLater = postedVariants; // To add to the product when uploading is finished.
                                $scope.uploadPhotosAndProduct();
                            }
                        }, function (err) {
                            console.log("Failed to post variant.");
                        });
                }
                if (variants.length == 0) {
                    $scope.uploadPhotosAndProduct();
                }
            }

            /**
             * Submits the new product object to the server.
             * @param form - the form.
             */
            $scope.submitEdit = function (form) {
                $scope.product.photos = $scope.photos;
                if (!validation(form, event)) {
                    return;
                }
                preparePriceAndDiscount();
                $scope.product.photos = $scope.photos;
                $scope.product.max_quantity = Math.round($scope.product.max_quantity);
                showLoadingDialog();

                //Update shipping methods. The submission process continues after receiving a notification from the ShippingMethods service.
                ShippingMethods.updateShippingMethods($scope.product, $scope.shipping_methods, $scope.originalShippingMethods);
            };

            /**
             * Continues the submission of the new product after updating the shipping methods.
             */
            $scope.continueEditSubmission = function () {
                // Update variants
                if (!$.isEmptyObject($scope.variants)) {
                    prepareVariants();
                    updateVariants();
                } else {
                    delete $scope.product.variants;
                    $scope.uploadPhotosAndProduct();
                }
            };

            $scope.uploadPhotosAndProduct = function () {
                // If there were changes in the photos, then upload the changes and wait for the message
                // that indicates that the upload is finished. If not, then just upload the product object.
                if ($scope.changedPhotos) {
                    $scope.oldPhotosURLs = ProductPhotos.setProductPhotosInArray($scope.product);
                    ProductPhotos.uploadPhotosOfProduct($scope.product, EP_SESSION);
                } else {
                    EditProduct.uploadModifiedProduct($scope.product);
                }
            };

            $scope.$on(BROADCASTING_PREFIX + EP_SESSION, function (event, args) {
                if (args.success) {
                    // Finished uploading photos, start uploading the product's data, and in the meantime delete the old photos form the s3.
                    $scope.product = args.product;
                    EditProduct.uploadModifiedProduct($scope.product);
                    if ($scope.oldPhotosURLs) {
                        ProductPhotos.deletePhotos($scope.oldPhotosURLs);
                    }
                } else {
                    hideLoadingDialog(event);
                    Dialogs.showAlertDialog("Update Failure :(", "There was an error while uploading the new photos, please try again.");
                    console.log("Couldn't upload the photos. Aborting upload process.");
                }
            });

            $scope.$on(ShippingMethods.UPDATE_FINISHED, function (event, args) {
                if (args.success) {
                    // Finished updating the shipping methods.
                    $scope.continueEditSubmission();
                } else {
                    hideLoadingDialog();
                    Dialogs.showAlertDialog("Update Failure :(", "There was an error in the update process, please try again.");
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
                    showAlertDialog(Translations.productEdit.missingPhotosTitle, Translations.productEdit.missingPhotosContent, event);
                    return false;
                }
                if (!$scope.product.title) {
                    showAlertDialog(Translations.productEdit.blankTitle, Translations.productEdit.blankTitleContent, event);
                    return false;
                }
                if ($scope.product.price == null) {
                    showAlertDialog(Translations.productEdit.blankPriceTitle, Translations.productEdit.blankPriceContent, event);
                    return false;
                }
                if ($scope.product.price <= 0) {
                    showAlertDialog(Translations.productEdit.invalidPriceTitle, Translations.productEdit.invalidPriceContent, event);
                    return false;
                }
                if ($scope.presentPercentageOff && $scope.product.percentage_off < 0) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContent, event);
                    return false;
                }
                if ($scope.presentPercentageOff && $scope.product.percentage_off > 100) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContent100, event);
                    return false;
                }
                if ($scope.presentOriginalPrice && $scope.product.original_price <= $scope.product.price) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContentOP, event);
                    return false;
                }
                if (!($scope.product.max_quantity > 0)) {
                    showAlertDialog(Translations.productEdit.invalidMaxQuantityTitle, Translations.productEdit.invalidMaxQuantityContent, event);
                    return false;
                }
                if ($scope.product.category != null) {
                    if ($scope.product.category.length == 0) {
                        showAlertDialog(Translations.productEdit.blankCategoryTitle, Translations.productEdit.blankCategoryContent, event);
                        return false;
                    }
                } else {
                    showAlertDialog(Translations.productEdit.blankCategoryTitle, Translations.productEdit.blankCategoryContent, event);
                    return false;
                }
                if (!ShippingMethods.validateShippingMethods($scope.shipping_methods)) {
                    return false;
                }

                return true;
            }

            $scope.deleteProduct = function (event) {
                var confirm = $mdDialog.confirm()
                    .title(Translations.viewDeal.deletionMessageTitle)
                    .textContent(Translations.viewDeal.deletionMessageContent)
                    .ariaLabel('Delete product')
                    .targetEvent(event)
                    .ok(Translations.general.approve)
                    .cancel(Translations.general.cancel);
                $mdDialog.show(confirm).then(function () {
                    Product.deleteProduct(PRODUCT_URL)
                        .then(function (response) {
                                // success
                                console.log("Product deleted successfully.");
                                $timeout($rootScope.showToast, 1000, true, Translations.viewDeal.deletedMessage);
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
                if (!$scope.savedChanges) {
                    var answer = confirm(Translations.general.confirmLeave);
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

            $scope.$on('$destroy', function () {
                EditProduct.product = null;
                window.onbeforeunload = null;
                // $locationChangeStartUnbind();
            });
        }]);