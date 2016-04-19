(function () {
    'use strict';

    angular.module('DealersApp')

        /**
         * The controller that manages the Add Product Procedure.
         */
        .controller('AddProduct1Controller', ['$scope', '$location', '$timeout', '$mdDialog', 'AddProduct', 'Photos',
            function ($scope, $location, $timeout, $mdDialog, AddProduct, Photos) {

                const CONFIRM_EXIT_MESSAGE = "The content will be lost.";

                $scope.photos = [];
                $scope.photosURLs = [];
                $scope.selectedIndex = 0;
                $scope.addPhotoText = "Add a Photo";

                $scope.selectPhoto = selectPhoto;
                $scope.changeThumbnailSelection = changeThumbnailSelection;
                $scope.checkIfActive = checkIfActive;

                loadProduct();
                loadPhotos();

                /**
                 * Loads the product object if it's in the AddProduct service. If not, checks if the product object is
                 * stored in the cookies. Else creates a new product object.
                 */
                function loadProduct() {
                    var product = AddProduct.getProduct();
                    if (!$.isEmptyObject(product) && product != null) {
                        $scope.product = product;
                    } else if (AddProduct.checkForSavedSessions()) {
                        // If the checkForSavedSessions returns true, that means that the saved session is in the product
                        // object of AddProduct service. Retrieve it. Also true for photosURLs.
                        $scope.product = AddProduct.getProduct();
                    } else {
                        $scope.product = {};
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
                                    $scope.photos.splice(indexesToDelete[i],1);
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
                    });
                };

                /**
                 * Shows the alert dialog.
                 */
                $scope.showAlertDialog = function () {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title("Duplicate Photo")
                            .textContent("This photo was already uploaded.")
                            .ariaLabel('Alert Dialog')
                            .ok("Got it")
                    );
                };
                
                /**
                 * Takes the user to the next step in uploading a product - More Details.
                 * @param basicInfoForm - the from.
                 */
                $scope.moreDetails = function (basicInfoForm) {
                    if (!validateBasicDetails(basicInfoForm)) {
                        return;
                    }
                    $scope.product.photos = $scope.photos;
                    AddProduct.setProduct($scope.product);
                    AddProduct.saveSession($scope.product, $scope.photosURLs);
                    $location.path('/new-product/more-details');
                };

                /**
                 * Runs a few validations on the user input.
                 * @returns {boolean} true if valid, else false.
                 */
                function validateBasicDetails(form) {
                    if ($scope.photos.length == 0) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title("Missing Photos")
                                .textContent("You must add photos of your product!")
                                .ariaLabel('Alert Dialog')
                                .ok("Got it")
                        );
                        return false
                    } else if (!form.$valid) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title("Title Is Blank")
                                .textContent("You must add a title for you product!")
                                .ariaLabel('Alert Dialog')
                                .ok("Got it")
                        );
                        return false;
                    }
                    return true;
                }

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
                    const processTitle = "new-product";
                    if (next.indexOf(processTitle) == -1 && ($scope.photos.length != 0 || $scope.basicInfoForm.$dirty)) {
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
            }]);
})();