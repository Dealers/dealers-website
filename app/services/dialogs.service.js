/**
 * Created by gullumbroso on 30/04/2016.
 */
angular.module('DealersApp')
    .factory('Dialogs', ['$rootScope', '$mdDialog', '$mdMedia', 'Translations', function DialogsFactory($rootScope, $mdDialog, $mdMedia, Translations) {

        var service = {};

        var customFullscreen = $mdMedia('xs');

        service.showSignUpViewerDialog = showSignUpViewerDialog;
        service.showSignInDialog = showSignInDialog;
        service.confirmDialog = confirmDialog;
        service.showAlertDialog = showAlertDialog;
        service.showLoadingDialog = showLoadingDialog;
        service.hideDialog = hideDialog;

        return service;


        function showSignUpViewerDialog(ev, email) {
            return $mdDialog.show({
                controller: 'SignInDialogController',
                templateUrl: 'app/components/views/sign-in/sign-up-viewer-dialog.view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {tab: null, isViewer: null, email: email}
            })
        }

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
                locals: {tab: tabIndex, isViewer: isViewer, email: null}
            });
        }

        /**
         * Returns the confirm dialog object of type confirm (doesn't show it).
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
                .cancel(Translations.general.cancel)
                .targetEvent(ev);
        }

        /**
         * Presents the alert dialog.
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
                    .ok(Translations.general.gotIt)
                    .targetEvent(ev)
            );
        }

        /**
         * Presents the loading dialog.
         * @param message - the message to present in the loading dialog.
         * @param ev - the event that triggered the loading.
         */
        function showLoadingDialog(message, ev) {
            $mdDialog.show({
                templateUrl: 'app/components/views/loading-dialog.view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                controller: 'LoadingDialogController',
                locals: {message: message},
                escapeToClose: false
            });
        }

        /**
         * Hides the dialog.
         * @param ev - the event that triggered the hiding.
         */
        function hideDialog(ev) {
            $mdDialog.hide();
        }
    }]);