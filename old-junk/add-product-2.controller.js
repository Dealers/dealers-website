(function () {
    'use strict';

    angular.module('DealersApp')

        /**
         * The controller that manages the second step of the Add Product Procedure.
         */
        .controller('AddProduct2Controller', ['$scope', '$rootScope', '$location', '$mdDialog', 'AddProduct', 'ProductPhotos', 'Analytics',
            function ($scope, $rootScope, $location, $mdDialog, AddProduct, ProductPhotos, Analytics) {

                var SHEKEL = '₪';
                var DOLLAR = '$';
                var EURO = '€';
                var PERCENTAGE = '%';
                var PREV_PRICE = '123';
                var CONFIRM_EXIT_MESSAGE = "The content will be lost.";
                var BASIC_INFO_PATH = "/new-product/basic-info";
                var NEXT_PAGE_PATH = "/new-product/spread-the-word";
                var LOADING_MESSAGE = "Uploading your product...";
                var AP_SESSION = 'apSession';
                var BROADCASTING_PREFIX = 'photos-downloaded-for-';
                var UPLOAD_FINISHED_MESSAGE = 'ap-upload-finished';

                $scope.currency = SHEKEL;
                $scope.discountType = PERCENTAGE;
                $scope.minDate = new Date();

                loadProduct();

                /**
                 * Loads the product object if it's in the AddProduct service. If not, checks if the product object is
                 * stored in the cookies.
                 */
                function loadProduct() {
                    var product = AddProduct.getProduct();
                    if (!$.isEmptyObject(product)) {
                        $scope.product = product;
                    } else if (AddProduct.checkForSavedSessions()) {
                        // If the checkForSavedSessions returns true, that means that the saved session is in the product
                        // object of AddProduct service. Retrieve it.
                        $scope.product = AddProduct.getProduct();
                    }
                    if (!$scope.product) {
                        AddProduct.clearSession();
                        $location.path(BASIC_INFO_PATH);
                        return;
                    }
                    if ($scope.product.photos) {
                        if ($scope.product.photos.length == 0) {
                            AddProduct.clearSession();
                            $location.path(BASIC_INFO_PATH);
                        }
                    } else {
                        AddProduct.clearSession();
                        $location.path(BASIC_INFO_PATH);
                    }
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
                 * Starts the upload process.
                 * @param form - the form that was submitted.
                 * @param event - the event that triggered the submission.
                 */
                $scope.submit = function (form, event) {
                    if (!validation(form, event)) {
                        return;
                    }
                    showLoadingDialog();
                    $scope.product.currency = $scope.currency;
                    if ($scope.product.discount_value) {
                        $scope.product.discount_type = $scope.discountType;
                    }
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
                $scope.$on(UPLOAD_FINISHED_MESSAGE, function(event, args) {
                    hideLoadingDialog();
                    if (args.success) {
                        $location.path(NEXT_PAGE_PATH);
                    } else {
                        console.log(args.message);
                        showAlertDialog("We're sorry, but there was a problem", args.message, event);
                    }
                });

                /**
                 * Validates that all the required fields were filled and that everything is valid.
                 * @param form - the form that was filled.
                 * @param event - the event that triggered the submission.
                 * @returns {boolean} - true if valid, else false.
                 */
                function validation(form, event) {
                    if ($scope.product.price == null) {
                        showAlertDialog("Blank Price", "Please add the price of your product!", event);
                        return false;
                    }
                    if ($scope.product.price <= 0) {
                        showAlertDialog("Not a Valid Price", "Please enter a valid price.", event);
                        return false;
                    }
                    if ($scope.product.discount_value <= 0) {
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

                window.onbeforeunload = function () {
                    AddProduct.saveSession($scope.product, $scope.photosURLs);
                    return CONFIRM_EXIT_MESSAGE;
                };

                /**
                 * Asks the user to confirm he wants to leave the Add Product process, explaining that it will cause the lost
                 * of the data he entered.
                 * @type {*|(function())}
                 */
                $scope.$on('$locationChangeStart', function (event, next) {
                    var processTitle = "new-product";
                    if (next.indexOf(processTitle) == -1) {
                        // The page that the user navigated to is not a part of the Add Product process. Present the
                        // confirm dialog.
                        var answer = confirm("Are you sure you want to leave this page? This process will be lost.");
                        if (!answer) {
                            event.preventDefault();
                            return;
                        }
                        AddProduct.clearSession();
                    }
                });

                $scope.$on('$destroy', function () {
                    window.onbeforeunload = null;
                    // $locationChangeStartUnbind();
                });
            }]);
})();