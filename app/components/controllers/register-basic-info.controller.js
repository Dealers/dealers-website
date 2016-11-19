/**
 * Created by gullumbroso on 12/11/2016.
 */

angular.module('DealersApp')
/**
 * The controller that is responsible for dialogs's behaviour.
 * @param $scope - the isolated scope of the controller.
 * @param $mdDialog - the mdDialog service of the Material Angular library.
 */
    .controller('RegisterBasicInfoController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdMedia', 'Dealer', 'DealerPhotos', 'Photos', 'Dialogs', 'Translations',
        function ($scope, $rootScope, $location, $mdDialog, $mdMedia, Dealer, DealerPhotos, Photos, Dialogs, Translations) {

            var RBI_SESSION = "register-basic-info-session";
            var ADD_PROFILE_PIC_BUTTON = "/assets/images/icons/@2x/Web_Icons_add_profile_pic_button.png";
            var PROFILE_PIC_BROADCASTING_PREFIX = 'dealer-pic-uploaded-for-';
            var REGISTER_BROADCASTING_PREFIX = 'register-basic-info-for-';

            $scope.photo = "";
            $scope.photoURL = "";
            $scope.croppedPhotoURL = ADD_PROFILE_PIC_BUTTON;
            $scope.registrationBasicInfoDone = false;
            $scope.dealer = $rootScope.dealer;

            setWatchersAndListeners();

            /**
             * Validates the General Info fields.
             * @param event - the event that triggered the validation.
             * @returns {boolean} - true if valid, else false.
             */
            function isGeneralInfoValid(event) {
                if ($scope.croppedPhotoURL == ADD_PROFILE_PIC_BUTTON) {
                    Dialogs.showAlertDialog(Translations.dealerRegistration.missingPhotoTitle, Translations.dealerRegistration.missingPhotoContent, event);
                    return false;
                } else if (!$scope.dealer.about) {
                    Dialogs.showAlertDialog(Translations.dealerRegistration.blankAboutTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                } else if (!$scope.dealer.location) {
                    Dialogs.showAlertDialog(Translations.dealerRegistration.blankLocationTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                }
                return true;
            }

            /**
             * Sets a couple of watchers and broadcasts listeners that are relevant for this controller.
             */
            function setWatchersAndListeners() {

                /**
                 * Listens to the DealerPhotos service's broadcasts when the dealer pic of the user has finished to upload.
                 */
                $scope.$on(PROFILE_PIC_BROADCASTING_PREFIX + RBI_SESSION, function (event, args) {
                    if (args.success) {
                        // Finished uploading the dealer pic, start uploading the bank account, and then the dealer object.
                        $rootScope.userProfilePic = $scope.croppedPhotoURL;
                        Dealer.registerBasicInfo(RBI_SESSION);
                    } else {
                        Dialogs.hideDialog(event);
                        console.log("Couldn't upload the dealer pic. Aborting upload process.");
                    }
                });

                /**
                 * Listens to the Dealer service's broadcasts when the dealer's info has finished to upload.
                 */
                $scope.$on(REGISTER_BROADCASTING_PREFIX + RBI_SESSION, function (event, args) {
                    if (args.success) {
                        // Registered
                        console.log("Dealer is registered with basic info successfully!");
                        window.onbeforeunload = null;
                        $scope.registrationBasicInfoDone = true;
                        Dialogs.hideDialog(event);
                        Dealer.existingDealer = false;
                        $location.path("/register/bank-account");
                    } else {
                        Dialogs.hideDialog(event);
                        Dialogs.showAlertDialog(
                            Translations.dealerRegistration.generalProblemTitle,
                            Translations.dealerRegistration.generalProblemContent,
                            event);
                    }
                });

                /**
                 * Watching for changes in the $scope.photoURL object so to know when to present the crop dialog for the dealer pic.
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
                        $scope.editProfilePic = Translations.dealerRegistration.addPhoto;
                    } else {
                        $scope.editProfilePic = Translations.dealerRegistration.changePhoto;
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
             * Clears the photo data from the scope's variables.
             */
            function clearPhotos() {
                $scope.photo = "";
                $scope.photoURL = "";
            }

            /**
             * Starts the registration process when the user finished filling the form.
             * @param registerBasicInfoForm - the form.
             */
            $scope.register = function (registerBasicInfoForm) {
                if (!isGeneralInfoValid()) {
                    return;
                }

                Dialogs.showLoadingDialog(Translations.dealerRegistration.uploading);
                var croppedPhoto = Photos.dataURItoBlob($scope.croppedPhotoURL);
                DealerPhotos.uploadPhoto(croppedPhoto, RBI_SESSION);
            };

            window.onbeforeunload = function () {
                return Translations.dealerRegistration.contentWillBeLost;
            };

            /**
             * Asks the user to confirm he wants to leave the Register As a Dealer process, explaining that it will cause the lost
             * of the data he entered.
             * @type {*|(function())}
             */
            $scope.$on('$locationChangeStart', function (event, next) {
                if (!$scope.registrationBasicInfoDone) {
                    var answer = confirm(Translations.dealerRegistration.contentWillBeLostFullMessage);
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.editProfilePic = Translations.dealerRegistration.addPhoto;
            });

            $scope.$on('$destroy', function () {
                window.onbeforeunload = null;
            });
        }]);