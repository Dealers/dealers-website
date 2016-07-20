/**
 * Created by gullumbroso on 24/04/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
        /**
         * The controller that is responsible for dialogs's behaviour.
         * @param $scope - the isolated scope of the controller.
         * @param $mdDialog - the mdDialog service of the Material Angular library.
         */
        .controller('RegisterAsDealerController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdMedia', 'Dealer', 'DealerPhotos', 'Photos',
            function ($scope, $rootScope, $location, $mdDialog, $mdMedia, Dealer, DealerPhotos, Photos) {

                var RAD_SESSION = "register-as-dealer-session";
                var GENERAL_TAB_INDEX = 0;
                var BANK_TAB_INDEX = 1;
                var NEXT_BUTTON_TITLE = "Next";
                var DONE_BUTTON_TITLE = "Done!";
                var ADD_PHOTO_BUTTON_TITLE = "Add Photo";
                var CHANGE_PHOTO_BUTTON_TITLE = "Change Photo";
                var ADD_PROFILE_PIC_BUTTON = "/assets/images/icons/@2x/Web_Icons_add_profile_pic_button.png";
                var PROFILE_PIC_BROADCASTING_PREFIX = 'profile-pic-uploaded-for-';
                var REGISTER_BROADCASTING_PREFIX = 'register-as-dealer-for-';
                var LOADING_MESSAGE = "Uploading...";
                var CONFIRM_EXIT_MESSAGE = "The content will be lost.";

                $scope.photo = "";
                $scope.photoURL = "";
                $scope.croppedPhotoURL = ADD_PROFILE_PIC_BUTTON;
                $scope.editProfilePic = ADD_PHOTO_BUTTON_TITLE;
                $scope.submitButtonTitle = NEXT_BUTTON_TITLE;
                $scope.registrationDone = false;

                $scope.dealer = $rootScope.dealer;
                $scope.bank_account = {};

                setWatchersAndListeners();

                /**
                 * This function is being called each time one of the tabs are being selected.
                 * @param tab - the selected tab.
                 */
                $scope.onTabSelected = function (tab) {
                    if (tab == 0) {
                        $scope.submitButtonTitle = NEXT_BUTTON_TITLE;
                    } else {
                        $scope.submitButtonTitle = DONE_BUTTON_TITLE;
                    }
                };

                /**
                 * Validates the General Info fields.
                 * @param event - the event that triggered the validation.
                 * @returns {boolean} - true if valid, else false.
                 */
                function isGeneralInfoValid(event) {
                    if ($scope.croppedPhotoURL == ADD_PROFILE_PIC_BUTTON) {
                        showAlertDialog("Profile Photo Missing", "You forgot to add a photo!", event);
                        return false;
                    } else if (!$scope.dealer.about) {
                        showAlertDialog("About field is blank", "This field is required.", event);
                        return false;
                    } else if (!$scope.dealer.location) {
                        showAlertDialog("Location field is blank", "This field is required.", event);
                        return false;
                    }
                    return true;
                }

                /**
                 * Validates the Bank Info fields.
                 * @param event - the event that triggered the validation.
                 * @returns {boolean} - true if valid, else false.
                 */
                function isBankInfoValid(event) {
                    if (!$scope.bank_account.account_number) {
                        showAlertDialog("Account number is blank", "This field is required.", event);
                        return false;
                    } else if (!$scope.bank_account.branch_number) {
                        showAlertDialog("Branch number is blank", "This field is required.", event);
                        return false;
                    } else if (!$scope.bank_account.bank) {
                        showAlertDialog("The bank field is blank", "This field is required.", event);
                        return false;
                    } else if (!$scope.bank_account.account_holder) {
                        showAlertDialog("Account holder name is blank", "This field is required.", event);
                        return false;
                    }
                    return true;
                }

                /**
                 * Sets a couple of watchers and broadcasts listeners that are relevant for this controller.
                 */
                function setWatchersAndListeners() {

                    /**
                     * Listens to the DealerPhotos service's broadcasts when the profile pic of the user has finished to upload.
                     */
                    $scope.$on(PROFILE_PIC_BROADCASTING_PREFIX + RAD_SESSION, function (event, args) {
                        if (args.success) {
                            // Finished uploading the profile pic, start uploading the bank account, and then the dealer object.
                            Dealer.registerDealer($scope.bank_account, RAD_SESSION);
                        } else {
                            hideLoadingDialog(event);
                            console.log("Couldn't upload the profile pic. Aborting upload process.");
                        }
                    });

                    /**
                     * Listens to the Dealer service's broadcasts when the dealer's info has finished to upload.
                     */
                    $scope.$on(REGISTER_BROADCASTING_PREFIX + RAD_SESSION, function (event, args) {
                        if (args.success) {
                            // Registered
                            console.log("Dealer is registered successfully!");
                            window.onbeforeunload = null;
                            $scope.registrationDone = true;
                            hideLoadingDialog();
                            $location.path("/done-registration");
                        } else {
                            hideLoadingDialog(event);
                            if (args.message.data) {
                                if (args.message.data.account_number[0]) {
                                    showAlertDialog(
                                        "Account number duplicate",
                                        "The account number you entered already exists. Please check your input again.",
                                        event);
                                } else {
                                    showAlertDialog(
                                        "There was a problem...",
                                        "We're sorry, please try again!",
                                        event);
                                }
                            } else {
                                showAlertDialog(
                                    "There was a problem...",
                                    "We're sorry, please try again!",
                                    event);
                            }
                        }
                    });

                    /**
                     * Watching for changes in the $scope.photoURL object so to know when to present the crop dialog for the profile pic.
                     */
                    $scope.$watch('photoURL', function () {
                        if ($scope.photoURL) {
                            if ($scope.photoURL.length > 0) {
                                $scope.showCropDialog();
                            }
                        }
                    });

                    /**
                     * Watching for changes in the $scope.croppedPhotoURL object so the title of the button will change accordingly.
                     */
                    $scope.$watch('croppedPhotoURL', function () {
                        if ($scope.croppedPhotoURL == ADD_PROFILE_PIC_BUTTON) {
                            $scope.editProfilePic = ADD_PHOTO_BUTTON_TITLE;
                        } else {
                            $scope.editProfilePic = CHANGE_PHOTO_BUTTON_TITLE;
                        }
                    });

                    /**
                     * Watching for changes in the media settings (width of browser window).
                     */
                    $scope.$watch(function () {
                        return $mdMedia('xs');
                    });
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
                 * Presents the crop dialog when the user wishes to upload a new profile pic.
                 */
                $scope.showCropDialog = function () {
                    var useFullScreen = ($mdMedia('xs'));
                    $mdDialog.show({
                            controller: "CropPhotoDialog",
                            templateUrl: 'app/components/signed-in/views/crop-photo-dialog.view.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            fullscreen: useFullScreen,
                            locals: {rawPhoto: $scope.photoURL}
                        })
                        .then(function (cropped) {
                            $scope.croppedPhotoURL = cropped;
                            clearPhotos();
                        }, function () {
                            clearPhotos();
                        });
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
                 * Clears the photo data from the scope's variables.
                 */
                function clearPhotos() {
                    $scope.photo = "";
                    $scope.photoURL = "";
                }

                /**
                 * Starts the registration process when the user finished filling the form.
                 * @param registerAsDealerForm - the form.
                 */
                $scope.register = function (registerAsDealerForm) {
                    if ($scope.selectedTab == GENERAL_TAB_INDEX) {
                        $scope.selectedTab = BANK_TAB_INDEX;
                        return;
                    }
                    if (!isGeneralInfoValid()) {
                        return;
                    }
                    if (!isBankInfoValid()) {
                        return;
                    }
                    $scope.bank_account.dealer = $scope.dealer.id;
                    showLoadingDialog();
                    var croppedPhoto = Photos.dataURItoBlob($scope.croppedPhotoURL);
                    DealerPhotos.uploadPhoto(croppedPhoto, RAD_SESSION);
                };

                window.onbeforeunload = function () {
                    return CONFIRM_EXIT_MESSAGE;
                };

                /**
                 * Asks the user to confirm he wants to leave the Register As a Dealer process, explaining that it will cause the lost
                 * of the data he entered.
                 * @type {*|(function())}
                 */
                $scope.$on('$locationChangeStart', function (event, next) {
                    if (!$scope.registrationDone) {
                        var answer = confirm("Are you sure you want to leave this page? This process will be lost.");
                        if (!answer) {
                            event.preventDefault();
                        }
                    }
                });

                $scope.$on('$destroy', function () {
                    window.onbeforeunload = null;
                });
            }]);
})();