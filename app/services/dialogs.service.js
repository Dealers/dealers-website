/**
 * Created by gullumbroso on 30/04/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
        .factory('Dialogs', DialogsFactory);

    DialogsFactory.$inject = ['$rootScope', '$mdDialog', '$mdMedia'];
    function DialogsFactory($rootScope, $mdDialog, $mdMedia) {

        var service = {};

        var customFullscreen = $mdMedia('xs');

        service.showSignInDialog = showSignInDialog;

        return service;


        /**
         * Presents the sign in dialog (sign up and log in) and returns the promise.
         * @param ev - The event that triggered the function.
         * @param tabIndex - the index of the selected option (sign up is 0, log in is 1).
         * @return {Promise} - the promise that will run if process finished successfully.
         */
        function showSignInDialog(ev, tabIndex) {
            return $mdDialog.show({
                    controller: 'SignInDialogController',
                    templateUrl: 'app/components/signed-in/views/sign-in/sign-in-dialog.view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: customFullscreen,
                    locals: {tab: tabIndex}
                });
        }
    }
})();
