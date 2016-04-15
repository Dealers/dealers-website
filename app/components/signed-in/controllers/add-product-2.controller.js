(function () {
    'use strict';

    angular.module('DealersApp')

        /**
         * The controller that manages the second step of the Add Product Procedure.
         */
        .controller('AddProduct2Controller', ['$scope', '$rootScope', '$location', '$mdDialog', 'AddProduct',
            function ($scope, $rootScope, $location, $mdDialog, AddProduct) {

                const SHEKEL = '₪';
                const DOLLAR = '$';
                const EURO = '€';
                const PERCENTAGE = '%';
                const PREV_PRICE = '123';
                const CONFIRM_EXIT_MESSAGE = "The content will be lost.";
                const BASIC_INFO_PATH = "/new-product/basic-info";
                const NEXT_PAGE_PATH = "/new-product/spread-the-word";
                const LOADING_MESSAGE = "Uploading your product...";

                $scope.currency = SHEKEL;
                $scope.discountType = PERCENTAGE;
                $scope.minDate = new Date();
                var originatorEv;

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
                    originatorEv = ev;
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
                 * Uploads the product to the server (via the AddProduct service).
                 * @param form
                 * @param event
                 */
                $scope.uploadProduct = function (form, event) {
                    if (!validation(form, event)) {
                        return;
                    }
                    $scope.product.currency = $scope.currency;
                    $scope.product.discount_type = $scope.discountType;
                    AddProduct.uploadProduct($scope.product);
                };

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

                /**
                 * Being called when the product started to be uploaded to the server.
                 */
                $scope.$on('ap-upload-started', function(event) {
                    showLoadingDialog(event);
                });

                /**
                 * Being called when the product finished to be uploaded, whether successfully or unsuccessfully.
                 */
                $scope.$on('ap-upload-finished', function(event, args) {
                    hideLoadingDialog();
                    if (args.success) {
                        $location.path(NEXT_PAGE_PATH);
                    } else {
                        console.log(args.message);
                        showAlertDialog("We're sorry, but there was a problem", args.message, event);
                    }
                });

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
                    const processTitle = "new-product";
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