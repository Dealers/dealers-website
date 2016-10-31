/**
 * Created by gullumbroso on 25/04/2016.
 */

angular.module('DealersApp')
/**
 * The controller of the dialog which enables the user to crop the photo that he uploaded.
 */
    .controller('CropPhotoDialog', ['$scope', '$rootScope', '$mdDialog', 'rawPhoto', 'Translations',
        function ($scope, $rootScope, $mdDialog, rawPhoto, Translations) {

            var DONE_BUTTON_TITLE = Translations.general.crop;
            var CANCEL_BUTTON_TITLE = Translations.general.cancel;

            $scope.rawPhotoURL = rawPhoto;
            $scope.croppedPhotoURL = "";

            $scope.crop = function () {
                $mdDialog.hide($scope.croppedPhotoURL);
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

        }]);