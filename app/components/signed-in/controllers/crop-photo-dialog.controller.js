/**
 * Created by gullumbroso on 25/04/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
        /**
         * The controller of the dialog which enables the user to crop the photo that he uploaded.
         */
        .controller('CropPhotoDialog', ['$scope', '$rootScope', '$mdDialog', 'rawPhoto',
            function ($scope, $rootScope, $mdDialog, rawPhoto) {

                var DONE_BUTTON_TITLE = "Crop";
                var CANCEL_BUTTON_TITLE = "Cancel";

                $scope.rawPhotoURL = rawPhoto;
                $scope.croppedPhotoURL = "";

                $scope.crop = function () {
                    $mdDialog.hide($scope.croppedPhotoURL);
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

            }]);
})();
