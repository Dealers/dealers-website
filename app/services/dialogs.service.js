/**
 * Created by gullumbroso on 30/04/2016.
 */
angular.module('DealersApp')
    .factory('Dialogs', ['$rootScope', '$mdDialog', '$mdMedia', function DialogsFactory($rootScope, $mdDialog, $mdMedia) {

        var service = {};

        var customFullscreen = $mdMedia('xs');

        service.showSignInDialog = showSignInDialog;
        service.confirmDialog = confirmDialog;
        service.showAlertDialog = showAlertDialog;

        return service;


        /**
         * Presents the sign in dialog (sign up and log in) and returns the promise.
         * @param ev - The event that triggered the function.
         * @param tabIndex - the index of the selected option (sign up is 0, log in is 1).
         * @param isViewer - true if triggered the sign up for viewers.
         * @return {Promise} - the promise that will run if process finished successfully.
         */
        function showSignInDialog(ev, tabIndex, isViewer) {
            return $mdDialog.show({
                controller: 'SignInDialogController',
                templateUrl: 'app/components/views/sign-in/sign-in-dialog.view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: customFullscreen,
                locals: {tab: tabIndex, isViewer: isViewer}
            });
        }

        /**
         * Returns the confirm dialog object of type confirm.
         *
         * @param title - the title of the alert dialog.
         * @param content - the content of the alert dialog.
         * @param confirm - the confirm button title.
         * @param ev - the event that triggered the alert.
         * @return {mdDialog} - the confirm dialog object.
         */
        function confirmDialog(title, content, confirm, ev) {
            return $mdDialog.confirm(ev)
                .parent(angular.element(document.body))
                .clickOutsideToClose(false)
                .title(title)
                .textContent(content)
                .ariaLabel('Confirm Dialog')
                .ok(confirm)
                .cancel("Cancel")
                .targetEvent(ev);
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
    }]);