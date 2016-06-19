(function () {
    'use strict';

    angular.module('DealersApp')
        .factory('DealerPhotos', DealerPhotosFactory);

    DealerPhotosFactory.$inject = ['$rootScope'];
    function DealerPhotosFactory($rootScope) {

        var KEY = "media/Profile_Photos/";
        var BROADCASTING_PREFIX = 'profile-pic-uploaded-for-';

        var service = {};

        service.DEFAULT_PROFILE_PIC = "assets/images/icons/@2x/default_profile_pic.png";

        service.hasProfilePic = hasProfilePic;
        service.getPhoto = getPhoto;
        service.uploadPhoto = uploadPhoto;

        return service;

        /**
         * Determines if the dealer has a profile picture or not.
         * @param photoAdderss - the address of the photo (if exists).
         * @returns {boolean} - true if exists, else false.
         */
        function hasProfilePic(photoAdderss) {
            return (photoAdderss.length > 2) && (photoAdderss != "None");
        }

        /**
         * Downloads the profile pic of the received user.
         * @param key - the key in which the photo is located.
         * @param dealerID - the id of the user.
         * @param sender - the controller that asked for the service.
         */
        function getPhoto(key, dealerID, sender) {
            $rootScope.s3.getObject(
                {Bucket: $rootScope.AWSS3Bucket, Key: key, ResponseContentType: "image/jpg"},
                function (error, data) {
                    var message;
                    if (error != null) {
                        message = "Failed to download dealer's profile pic" + dealerID + ":" + error.message;
                        $rootScope.$broadcast('downloaded-' + sender + '-profile-pic-' + dealerID, {
                            success: false,
                            message: message
                        });
                    } else {
                        message = "Downloaded dealer's profile pic successfully!";
                        var blob = new Blob([data.Body], {'type': 'image/png'});
                        var url = URL.createObjectURL(blob);
                        $rootScope.$broadcast('downloaded-' + sender + '-profile-pic-' + dealerID, {
                            success: true,
                            data: url
                        });
                    }
                }
            );
        }

        /**
         * Uploads the profile pic of the user.
         * @param photo - the user's profile pic.
         * @param sender - the controller that asked for the service.
         */
        function uploadPhoto(photo, sender) {
            var photoName = generatePhotoName();
            var params = {
                Bucket: $rootScope.AWSS3Bucket,
                Key: KEY + photoName,
                Body: photo
            };
            $rootScope.s3.putObject(params, function (err, data) {
                if (err) {
                    // There Was An Error With Your S3 Config
                    console.log("There was an error with s3 config: " + err.message);
                    $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {success: false, data: err.message});
                }
                else {
                    console.log("Profile pic upload complete.");
                    $rootScope.dealer.photo = KEY + photoName;
                    $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {success: true, data: data});
                }
            });
        }

        /**
         * Generates a name to every photo that is about to be uploaded to the s3.
         * @returns {string} - the generated name.
         */
        function generatePhotoName() {
            var dealerID = String($rootScope.dealer.id);
            var d = new Date();
            var date = String(d.getTime() / 1000);
            return dealerID + "_" + date + "_" + "profile" + ".png";
        }
    }
})();