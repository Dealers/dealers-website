/**
 * Created by gullumbroso on 11/08/2016.
 */
angular.module('DealersApp')

/**
 * The controller that manages the Add Product Procedure.
 */
    .controller('AddProductController', ['$rootScope', '$scope', '$location', '$timeout', '$mdDialog', '$mdConstant', 'AddProduct', 'Product', 'Photos', 'ProductPhotos', 'Analytics', 'Defaults', 'Dealer', 'ShippingMethods', 'Translations',

        function ($rootScope, $scope, $location, $timeout, $mdDialog, $mdConstant, AddProduct, Product, Photos, ProductPhotos, Analytics, Defaults, Dealer, ShippingMethods, Translations) {

            var CONFIRM_EXIT_MESSAGE = "The content will be lost.";
            var BASIC_DETAILS_INDEX = 0;
            var MORE_DETAILS_INDEX = 1;
            var AP_SESSION = 'apSession';
            var BROADCASTING_PREFIX = 'photos-downloaded-for-';
            var UPLOAD_FINISHED_MESSAGE = 'ap-upload-finished';
            var NEXT_PAGE_PATH = "/new-product/spread-the-word";
            var DEFAULT_QUANTITY = 10;
            var DEFAULT_MAX_QUANTITY = 10;

            $scope.photos = [];
            $scope.photosURLs = [];
            $scope.selectedPhotoIndex = 0;
            $scope.showDiscount = false;
            $scope.variants = {};
            $scope.translations = {}; // Translations that should be inserted in the scope for presentations in the view.
            $scope.DEALERS_SHIPPING_PRICE = ShippingMethods.DEALERS_SHIPPING_PRICE;
            $scope.DEALERS_SHIPPING_ETD = ShippingMethods.DEALERS_SHIPPING_ETD;
            $scope.shipping_methods = { // Default shipping methods values.
                dealers: ShippingMethods.DEFAULT_DEALER_SHIIPPING,
                custom: {selected: false},
                pickup: ShippingMethods.DEFAULT_PICKUP_SHIIPPING
            };
            $scope.submitButtonTitle = Translations.productEdit.submitTitleNext;
            $scope.showDiscountTitle = Translations.productEdit.addDiscount;
            $scope.placeholderNames = Translations.productEdit.placeholderNames;
            $scope.placeholderOptions = Translations.productEdit.placeholderOptions;
            $scope.presentDealersInfo = false;
            $scope.presentCustomInfo = false;
            $scope.presentPickupInfo = false;
            $scope.maxVariants = 3;
            $scope.variations = [];

            if ($rootScope.language == "he") {
                $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.TAB];
            } else {
                $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.TAB];
            }

            $scope.shouldBeTabIndex = -1;


            $scope.selectPhoto = selectPhoto;
            $scope.changeThumbnailSelection = changeThumbnailSelection;
            $scope.checkIfActive = checkIfActive;
            $scope.showAlertDialog = showAlertDialog;

            initialize();

            function initialize() {
                loadProduct();
                loadScopeTranslations();
                loadDefaults();
                loadPhotos();

                $scope.$watch("product.currency", function () {

                    if ($scope.product.currency == '₪') {
                        $scope.shipping_methods.dealers.shipping_price = $scope.DEALERS_SHIPPING_PRICE = 35;
                    } else if ($scope.product.currency == '$') {
                        $scope.shipping_methods.dealers.shipping_price = $scope.DEALERS_SHIPPING_PRICE = 10;
                    } else if ($scope.product.currency == '€') {
                        $scope.shipping_methods.dealers.shipping_price = $scope.DEALERS_SHIPPING_PRICE = 9;
                    }
                });
            }

            /**
             * Loads the product object if it's in the AddProduct service. If not, checks if the product object is
             * stored in the cookies. Else creates a new product object.
             */
            function loadProduct() {
                var product = AddProduct.getProduct();
                if (!$.isEmptyObject(product) && product != null) {
                    $scope.product = Product.unStringifyObject(product);
                } else if (AddProduct.checkForSavedSessions()) {
                    // If the checkForSavedSessions returns true, that means that the saved session is in the product
                    // object of AddProduct service. Retrieve it. Also true for photosURLs.
                    $scope.product = Product.unStringifyObject(AddProduct.getProduct());
                } else {
                    $scope.product = {};
                }

                if ($scope.dealer.country == "Israel") {
                    $scope.product.currency = '₪';
                } else {
                    $scope.product.currency = '$';
                }
                $scope.product.inventory = DEFAULT_QUANTITY;
                $scope.product.max_quantity = DEFAULT_MAX_QUANTITY;
            }

            function loadScopeTranslations() {
                $scope.translations.placeholderNames = Translations.productEdit.placeholderNames;
                $scope.translations.placeholderOptions = Translations.productEdit.placeholderOptions;
            }

            function loadDefaults() {
                // Shipping methods
                if ($scope.dealer.dealers_delivery || $scope.dealer.custom_delivery || $scope.dealer.pickup_delivery) {
                    // At least one of the delivery methods of the dealer are not null, which means that there is a
                    // default shipping preference for this dealer.
                    if ($scope.dealer.dealers_delivery) {
                        $scope.shipping_methods.dealers = $scope.dealer.dealers_delivery;
                        $scope.shipping_methods.dealers.selected = true;
                    }
                    if ($scope.dealer.custom_delivery) {
                        $scope.shipping_methods.custom = $scope.dealer.custom_delivery;
                        $scope.shipping_methods.custom.selected = true;
                    }
                    if ($scope.dealer.pickup_delivery) {
                        $scope.shipping_methods.pickup = $scope.dealer.pickup_delivery;
                        $scope.shipping_methods.pickup.selected = true;
                    }
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
                $scope.selectedPhotoIndex = index;
                $scope.changeThumbnailSelection(index);
                $scope.shouldBeTabIndex = $scope.selectedTab;
                $timeout(function () {
                    $('.carousel-inner div').each(function (i) {
                        if ($scope.selectedPhotoIndex == i) {
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

                if (!$scope.checkIfActive($scope.selectedPhotoIndex)) {
                    // The current photo doesn't have the 'active' class yet, which means the slide animation isn't finished
                    // yet.
                    return;
                }

                if ($(chevronButton).hasClass("left")) {
                    index = $scope.selectedPhotoIndex - 1;
                    if (index < 0) {
                        index = photosNum - 1;
                    }
                } else if ($(chevronButton).hasClass("right")) {
                    index = $scope.selectedPhotoIndex + 1;
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
                });
            };

            /**
             * Opens an angular-material dropdown menu.
             * @param $mdOpenMenu - the menu to open.
             * @param ev - the event that triggered the function.
             */
            $scope.openMenu = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            $scope.presentDiscountControllers = function (event) {
                if ($scope.showDiscount) {
                    $scope.showDiscount = false;
                    $scope.showDiscountTitle = Translations.productEdit.addDiscount;
                } else {
                    $scope.showDiscount = true;
                    $scope.showDiscountTitle = Translations.productEdit.removeDiscount;
                }

            };

            $scope.changePrice = function (event) {
                if ($scope.product.percentage_off > 0) {
                    $scope.changePercentageOff(event);
                }
            };

            $scope.changePercentageOff = function (event) {
                if ($scope.product.percentage_off) {
                    var margin = 100 - $scope.product.percentage_off;
                    if (margin <= 0) {
                        $scope.product.price = 0;
                        $scope.product.original_price = null;
                    } else {
                        $scope.product.original_price = ($scope.product.price / margin) * 100;
                    }
                }
            };

            $scope.changeOriginalPrice = function (event) {
                var percentage_off = (1 - ($scope.product.price / $scope.product.original_price)) * 100;
                $scope.product.percentage_off = Math.round(percentage_off * 100) / 100; // Keep only 2 decimals.
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
             * Toggles the delivery (shipping method) selection.
             * @param item The shipping method.
             * @param list The
             */
            $scope.toggleDelivery = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };

            $scope.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };

            /**
             * This function is being called each time one of the tabs are being selected.
             * @param tab - the selected tab.
             */
            $scope.onTabSelected = function (tab) {
                if (tab == 0) {
                    $scope.submitButtonTitle = Translations.productEdit.submitTitleNext;
                } else {
                    $scope.submitButtonTitle = Translations.productEdit.submitTitleDone;
                }
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
             * Presents the loading dialog.
             * @param ev - the event that triggered the loading.
             */
            function showLoadingDialog(ev) {
                $mdDialog.show({
                    templateUrl: 'app/components/views/loading-dialog.view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'LoadingDialogController',
                    locals: {message: Translations.productEdit.uploadLoading},
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
             * Validates the basic details inputs.
             * @returns {boolean} true if valid, else false.
             */
            function validateBasicDetails(form, event) {
                if (!$scope.product.title) {
                    showAlertDialog(Translations.productEdit.blankTitle, Translations.productEdit.blankTitleContent, event);
                    return false;
                } else if ($scope.photos.length == 0) {
                    showAlertDialog(Translations.productEdit.missingPhotosTitle, Translations.productEdit.missingPhotosContent, event);
                    return false;
                }
                return true;
            }

            /* Validates the more details input.
             * @param form - the form that was filled.
             * @returns {boolean} - true if valid, else false.
             */
            function validateMoreDetails(form, event) {
                if ($scope.product.price == null) {
                    showAlertDialog(Translations.productEdit.blankPriceTitle, Translations.productEdit.blankPriceContent, event);
                    return false;
                }
                if ($scope.product.price <= 0) {
                    showAlertDialog(Translations.productEdit.invalidPriceTitle, Translations.productEdit.invalidPriceContent, event);
                    return false;
                }
                if ($scope.product.percentage_off < 0) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContent, event);
                    return false;
                }
                if ($scope.product.percentage_off > 100) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContent100, event);
                    return false;
                }
                if ($scope.product.original_price != null && $scope.product.original_price <= $scope.product.price) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContentOP, event);
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
                if ($scope.product.max_quantity <= 0 || $scope.product.max_quantity > 10000) {
                    showAlertDialog(Translations.productEdit.invalidMaxQuantityTitle, Translations.productEdit.invalidMaxQuantityContent, event);
                    return false;
                }

                return true;
            }

            /**
             * Organizes the price and discount input before upload.
             */
            function preparePriceAndDiscount() {
                if (!$scope.showDiscount) {
                    $scope.product.percentage_off = null;
                    $scope.product.original_price = null;
                    return;
                }
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
             * Arranges the selected shipping methods in the scope's product object.
             */
            function prepareShippingMethods() {
                if ($scope.shipping_methods.dealers.selected) {
                    $scope.product.dealers_delivery = $scope.shipping_methods.dealers;
                    $scope.product.dealers_delivery.delivery_method = ShippingMethods.DEALERS_METHOD;
                    $scope.product.dealers_delivery = ShippingMethods.convertDeliveryToServer($scope.product.dealers_delivery);
                } else {
                    $scope.product.dealers_delivery = null;
                }
                if ($scope.shipping_methods.custom.selected) {
                    $scope.product.custom_delivery = $scope.shipping_methods.custom;
                    $scope.product.custom_delivery.delivery_method = ShippingMethods.CUSTOM_METHOD;
                    $scope.product.custom_delivery = ShippingMethods.convertDeliveryToServer($scope.product.custom_delivery);
                } else {
                    $scope.product.custom_delivery = null;

                }
                if ($scope.shipping_methods.pickup.selected) {
                    $scope.product.pickup_delivery = $scope.shipping_methods.pickup;
                    $scope.product.pickup_delivery.delivery_method = ShippingMethods.PICKUP_METHOD;
                } else {
                    $scope.product.pickup_delivery = null;
                }
            }

            $scope.addProduct = function (addProductForm, event) {
                if ($scope.selectedTab == BASIC_DETAILS_INDEX) {
                    $scope.selectedTab = MORE_DETAILS_INDEX;
                    $('html, body').animate({scrollTop: 0}, 800);
                    return;
                }
                if (!validateBasicDetails(addProductForm, event)) {
                    return;
                }
                if (!validateMoreDetails(addProductForm, event)) {
                    return;
                }
                if (!ShippingMethods.validateShippingMethods($scope.shipping_methods)) { // Definition the product-edit directive.
                    return;
                }
                preparePriceAndDiscount();
                if (!$.isEmptyObject($scope.variants)) {
                    prepareVariants();
                    $scope.product.variants = Product.parseVariantsToServer($scope.variants);
                }
                prepareShippingMethods();
                $scope.product.photos = $scope.photos;
                $scope.product.max_quantity = Math.round($scope.product.max_quantity);
                showLoadingDialog();
                ProductPhotos.uploadPhotosOfProduct($scope.product, AP_SESSION);
            };

            $scope.$on(BROADCASTING_PREFIX + AP_SESSION, function (event, args) {
                var data = args.data;
                if (args.success) {
                    // Finished uploading photos, start uploading the product's data.
                    $scope.product = args.product;
                    AddProduct.uploadProduct($scope.product);
                    Analytics.trackEvent('Product', 'add', $scope.product.category);
                } else {
                    hideLoadingDialog(event);
                    console.log("Couldn't upload the photos. Aborting upload process.");
                }
            });

            /**
             * Being called when the product finished to be uploaded, whether successfully or unsuccessfully.
             */
            $scope.$on(UPLOAD_FINISHED_MESSAGE, function (event, args) {
                hideLoadingDialog();
                if (args.success) {
                    Defaults.updateShippingMethods(args.product, args.product.dealer);
                    Dealer.updateCurrentUser(args.product.dealer);
                    Intercom('trackEvent', 'added_product', {
                        product_id: args.product.id,
                        product_title: args.product.title
                    });
                    $location.path(NEXT_PAGE_PATH);
                } else {
                    console.log(args.message);
                    showAlertDialog("We're sorry, but there was a problem", args.message, event);
                }
            });

            window.onbeforeunload = function () {
                AddProduct.saveSession($scope.product, $scope.photosURLs);
                if ($scope.photos.length > 0 || !$.isEmptyObject($scope.product)) {
                    return CONFIRM_EXIT_MESSAGE;
                }
            };

            /**
             * Asks the user to confirm he wants to leave the Add Product process, explaining that it will cause the lost
             * of the data he entered.
             * @type {*|(function())}
             */
            var $locationChangeStartUnbind = $scope.$on('$locationChangeStart', function (event, next) {
                var processTitle = "new-product";
                if (next.indexOf(processTitle) == -1 && ($scope.photos.length != 0 || $scope.addProductForm.$dirty)) {
                    // The page that the user navigated to is not a part of the Add Product process. Present the
                    // confirm dialog.
                    var answer = confirm(Translations.general.confirmLeave);
                    if (!answer) {
                        event.preventDefault();
                        return;
                    }
                    AddProduct.clearSession();
                }
            });

            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.submitButtonTitle = Translations.productEdit.submitTitleNext;
                $scope.showDiscountTitle = Translations.productEdit.addDiscount;
                $scope.placeholderNames = Translations.productEdit.placeholderNames;
                $scope.placeholderOptions = Translations.productEdit.placeholderOptions;
                $scope.shipping_methods.dealers.title = ShippingMethods.DEALERS_SHIPPING_TITLE;
                $scope.shipping_methods.dealers.description = ShippingMethods.DEALERS_SHIPPING_DESCRIPTION;
            });

            $scope.$on('$destroy', function () {
                window.onbeforeunload = null;
            })
        }]);