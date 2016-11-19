/**
 * Created by gullumbroso on 28/07/2016.
 */
angular.module('DealersApp')

    .controller('EditProfileController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdMedia', '$mdToast', '$routeParams', '$timeout', 'Dealer', 'Photos', 'DealerPhotos', 'Dialogs',
        function ($scope, $rootScope, $location, $mdDialog, $mdMedia, $mdToast, $routeParams, $timeout, Dealer, Photos, DealerPhotos, Dialogs) {

            var LOADING_STATUS = 'loading';
            var DOWNLOADED_STATUS = 'downloaded';
            var FAILED_STATUS = 'failed';
            var CONFIRM_EXIT_MESSAGE = "The changes you made will be lost.";
            var LOADING_MESSAGE = "Saving changes...";
            var EPR_SESSION = 'eprSession';
            var DONE_UPLOAD_MESSAGE = "Changes Saved!";
            var DEALER_MODE = "dealer_mode";
            var VIEWER_MODE = "viewer_mode";
            var ADD_PROFILE_PIC_BUTTON = "/assets/images/icons/@2x/Web_Icons_add_profile_pic_button.png";
            var ADD_PHOTO_BUTTON_TITLE = "Add Photo";
            var CHANGE_PHOTO_BUTTON_TITLE = "Change Photo";
            var PROFILE_PIC_BROADCASTING_PREFIX = 'dealer-pic-uploaded-for-';
            var UPDATE_BROADCASTING_PREFIX = 'update-as-dealer-for-';

            $scope.status = LOADING_STATUS;
            $scope.dealerID = $routeParams.dealerID;
            $scope.originalDealer = {}; // The dealer without the changes that were taken place in this Edit Profile session.
            $scope.newDealer = {};
            $scope.bank_account = {};
            $scope.changedPhoto = false;
            $scope.savedChanges = false;
            $scope.userMode = VIEWER_MODE;
            $scope.photo = "";
            $scope.photoURL = "";
            $scope.croppedPhotoURL = "";
            $scope.editProfilePic = CHANGE_PHOTO_BUTTON_TITLE;
            $scope.editingDone = false;

            initialize();

            function initialize() {
                setWatchersAndListeners();
                $scope.profile = $.extend(true, {}, $rootScope.dealer);
                if ($scope.profile) {
                    if ($scope.profile.id) {
                        setProfileDetails();
                        return;
                    }
                }
                downloadProfileDetails();
            }

            /**
             * Downloads the user's information in case it is absent.
             */
            function downloadProfileDetails() {
                Dealer.getDealer($scope.dealerID)
                    .then(function (response) {
                        $scope.profile = response.data;
                        setProfileDetails();
                    }, function (er) {
                        $scope.status = FAILED_STATUS;
                        console.log("The dealer information was absent and couldn't download it from the server.");
                    })
            }

            /**
             * Sets the user's profile information in the fields as predefined values.
             */
            function setProfileDetails() {
                $scope.status = DOWNLOADED_STATUS;

                $scope.bank_account = $scope.profile.bank_accounts[$scope.profile.bank_accounts.length - 1];
                if (!$scope.bank_account) {
                    $scope.bank_account = {};
                }

                determineUserMode();
                setProfilePic();
                if ($scope.userMode == VIEWER_MODE) {
                    $scope.datepicker = {
                        opened: false,
                        options: {
                            formatYear: 'yyyy',
                            maxDate: new Date(),
                            showWeeks: false,
                            initDate: new Date($scope.profile.date_of_birth)
                        }
                    };
                }
            }

            /**
             * Determines the user's role (viewer or dealer).
             */
            function determineUserMode() {
                if ($scope.profile.role == $scope.roles.dealer) {
                    $scope.userMode = DEALER_MODE;
                }
            }

            /**
             * Sets the profile pic of the user.
             */
            function setProfilePic() {
                if ($rootScope.userProfilePic) {
                    $scope.photoURL = $rootScope.userProfilePic;
                    $scope.croppedPhotoURL = $rootScope.userProfilePic;
                    return;
                }
                $scope.profilePicStatus = LOADING_STATUS;
                $scope.hasProfilePic = DealerPhotos.hasProfilePic($scope.profile.photo);
                var sender = 'dealer';
                if ($scope.hasProfilePic) {
                    DealerPhotos.getPhoto($scope.profile.photo, $scope.profile.id, sender);
                    $scope.profilePicStatus = LOADING_STATUS;
                }
                $scope.$on('downloaded-' + sender + '-dealer-pic-' + $scope.profile.id, function (event, args) {
                    if (args.success) {
                        $scope.$apply(function () {
                            $scope.croppedPhotoURL = args.data;
                            $scope.profilePicStatus = DOWNLOADED_STATUS;
                        });
                    } else {
                        $scope.profilePicStatus = FAILED_STATUS;
                        console.log(args.message);
                    }
                });
            }

            /**
             * Sets a couple of watchers and broadcasts listeners that are relevant for this controller.
             */
            function setWatchersAndListeners() {

                /**
                 * Listens to the DealerPhotos service's broadcasts when the dealer pic of the user has finished to upload.
                 */
                $scope.$on(PROFILE_PIC_BROADCASTING_PREFIX + EPR_SESSION, function (event, args) {
                    if (args.success) {
                        // Finished uploading the dealer pic, start uploading the bank account, and then the dealer object.
                        $scope.profile.photo = $rootScope.dealer.photo;
                        $rootScope.userProfilePic = $scope.croppedPhotoURL;
                        updateUserDetails();
                    } else {
                        hideLoadingDialog(event);
                        console.log("Couldn't upload the dealer pic. Aborting upload process.");
                    }
                });

                /**
                 * Listens to the Dealer service's broadcasts when the dealer's info has finished to upload.
                 */
                $scope.$on(UPDATE_BROADCASTING_PREFIX + EPR_SESSION, function (event, args) {
                    if (args.success) {
                        // Updated
                        console.log("Dealer was updated successfully!");
                        window.onbeforeunload = null;
                        $scope.editingDone = true;
                        hideLoadingDialog();
                        $location.path("/dealers/" + $scope.dealerID);
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
                 * Watching for changes in the $scope.photoURL object so to know when to present the crop dialog for the dealer pic.
                 */
                $scope.$watch('photoURL', function () {
                    if ($scope.photoURL) {
                        if ($scope.photoURL.length > 0 && $scope.photoURL != $rootScope.userProfilePic) {
                            $scope.changedPhoto = true;
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
            }

            /**
             * Presents the crop dialog when the user wishes to upload a new dealer pic.
             */
            $scope.showCropDialog = function () {
                var useFullScreen = ($mdMedia('xs'));
                $mdDialog.show({
                    controller: "CropPhotoDialog",
                    templateUrl: 'app/components/views/crop-photo-dialog.view.html',
                    parent: angular.element(document.body),
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
             * Opens the datepicker pop up.
             * @param event - the event that triggered the opening.
             */
            $scope.openDatepicker = function (event) {
                $scope.datepicker.opened = true;
            };

            /**
             * Converts the date from string representation to Date object.
             * @param dateString - the date represented as a string.
             * @returns {Date} - a Date object.
             * @constructor
             */
            $scope.Date = function (dateString) {
                return new Date(dateString);
            };

            /**
             * Validates the Basic Info of Viewer fields.
             * @param event - the event that triggered the validation.
             * @returns {boolean} - true if valid, else false.
             */
            function isViewerBasicInfoValid(event) {
                if (!$scope.profile.full_name) {
                    showAlertDialog("The name field is blank", "This field is required.", event);
                    return false;
                }
                return true;
            }

            /**
             * Validates the Basic Info of Dealer fields.
             * @param event - the event that triggered the validation.
             * @returns {boolean} - true if valid, else false.
             */
            function isDealerBasicInfoValid(event) {
                if (!$scope.profile.full_name) {
                    showAlertDialog("The name field is blank", "This field is required.", event);
                    return false;
                } else if (!$scope.profile.about) {
                    showAlertDialog("About field is blank", "This field is required.", event);
                    return false;
                } else if (!$scope.profile.location) {
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

            $scope.submitEdit = function (form) {
                if ($scope.userMode == VIEWER_MODE) {
                    if (!isViewerBasicInfoValid()) {
                        return;
                    }
                } else {
                    if (!isDealerBasicInfoValid()) {
                        return;
                    }
                    if (!$.isEmptyObject($scope.bank_account) && !isBankInfoValid()) {
                        return;
                    }
                }
                showLoadingDialog();
                if ($scope.changedPhoto) {
                    var croppedPhoto = Photos.dataURItoBlob($scope.croppedPhotoURL);
                    DealerPhotos.uploadPhoto(croppedPhoto, EPR_SESSION);
                } else {
                    updateUserDetails();
                }
            };

            /**
             * Calls the right update method in the Dealers service according to the role of the user.
             */
            function updateUserDetails() {
                if ($scope.userMode == VIEWER_MODE) {
                    Dealer.updateViewer($scope.profile, EPR_SESSION);
                } else {
                    Dealer.updateDealer($scope.bank_account, $scope.profile, EPR_SESSION);
                }
            }

            window.onbeforeunload = function () {
                return CONFIRM_EXIT_MESSAGE;
            };

            /**
             * Asks the user to confirm he wants to leave the Add Product process, explaining that it will cause the lost
             * of the data he entered.
             * @type {*|(function())}
             */
            $scope.$on('$locationChangeStart', function (event, next) {
                if (!$scope.editingDone) {
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