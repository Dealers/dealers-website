/**
 * Created by gullumbroso on 12/11/2016.
 */

angular.module('DealersApp')
/**
 * The controller that is responsible for dialogs's behaviour.
 * @param $scope - the isolated scope of the controller.
 * @param $mdDialog - the mdDialog service of the Material Angular library.
 */
    .controller('RegisterBankAccountController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdMedia', 'Dealer', 'DealerPhotos', 'Photos', 'Dialogs', 'Translations',
        function ($scope, $rootScope, $location, $mdDialog, $mdMedia, Dealer, DealerPhotos, Photos, Dialogs, Translations) {

            var RBA_SESSION = "register-bank-account-session";
            var REGISTER_BANK_ACCOUNT_BROADCASTING_PREFIX = 'register-bank-account-for-';

            $scope.registrationBankAccountDone = false;
            $scope.dealer = $rootScope.dealer;
            $scope.bank_account = {};

            setWatchersAndListeners();

            /**
             * Validates the Bank Info fields.
             * @param event - the event that triggered the validation.
             * @returns {boolean} - true if valid, else false.
             */
            function isBankInfoValid(event) {
                if (!$scope.bank_account.account_number) {
                    Dialogs.showAlertDialog(Translations.dealerRegistration.blankAccountNumberTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                } else if (!$scope.bank_account.branch_number) {
                    Dialogs.showAlertDialog(Translations.dealerRegistration.blankBranchNumberTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                } else if (!$scope.bank_account.bank) {
                    Dialogs.showAlertDialog(Translations.dealerRegistration.blankBankTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                } else if (!$scope.bank_account.account_holder) {
                    Dialogs.showAlertDialog(Translations.dealerRegistration.blankAccountHolderTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                }
                return true;
            }

            /**
             * Sets a couple of watchers and broadcasts listeners that are relevant for this controller.
             */
            function setWatchersAndListeners() {

                /**
                 * Listens to the Dealer service's broadcasts when the dealer's info has finished to upload.
                 */
                $scope.$on(REGISTER_BANK_ACCOUNT_BROADCASTING_PREFIX + RBA_SESSION, function (event, args) {
                    if (args.success) {
                        // Registered
                        console.log("Dealer is registered with bank account info successfully!");
                        $rootScope.dealer.bank_account = args.message.bankAccount;
                        window.onbeforeunload = null;
                        $scope.registrationBankAccountDone = true;
                        Dialogs.hideDialog();
                        $location.path("/done-registration");
                    } else {
                        Dialogs.hideDialog(event);
                        if (args.message.data) {
                            if (args.message.data.account_number[0]) {
                                Dialogs.showAlertDialog(
                                    Translations.dealerRegistration.accountNumberDuplicateTitle,
                                    Translations.dealerRegistration.accountNumberDuplicateContent,
                                    event);
                            } else {
                                Dialogs.showAlertDialog(
                                    Translations.dealerRegistration.generalProblemTitle,
                                    Translations.dealerRegistration.generalProblemContent,
                                    event);
                            }
                        } else {
                            Dialogs.showAlertDialog(
                                Translations.dealerRegistration.generalProblemTitle,
                                Translations.dealerRegistration.generalProblemContent,
                                event);
                        }
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
             * Starts the registration process when the user finished filling the form.
             * @param registerBankAccountForm - the form.
             */
            $scope.register = function (registerBankAccountForm) {
                if (!isBankInfoValid()) {
                    return;
                }
                $scope.bank_account.dealer = $scope.dealer.id;
                Dialogs.showLoadingDialog(Translations.dealerRegistration.uploading);
                Dealer.registerBankAccount($scope.bank_account, RBA_SESSION);
            };

            $scope.skip = function (event) {
                Dialogs.showConfirmDialog(
                    Translations.dealerRegistration.skipConfirmTitle,
                    Translations.dealerRegistration.skipConfirmContent,
                    Translations.dealerRegistration.skipConfirmButton,
                    event)
                    .then(function() {
                        $scope.registrationBankAccountDone = true;
                        $location.path("/done-registration");
                    })
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
                if (!$scope.registrationBankAccountDone) {
                    var answer = confirm(Translations.dealerRegistration.contentWillBeLostFullMessage);
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

            $scope.$on('$destroy', function () {
                window.onbeforeunload = null;
            });
        }]);