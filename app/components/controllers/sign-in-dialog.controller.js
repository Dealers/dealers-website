/**
 * Created by gullumbroso on 22/04/2016.
 */

angular.module('DealersApp')
/**
 * The controller that is responsible for dialogs's behaviour.
 * @param $scope - the isolated scope of the controller.
 * @param $mdDialog - the mdDialog service of the Material Angular library.
 */
    .controller('SignInDialogController', ['$scope', '$rootScope', '$mdDialog', 'Dealer', 'tab', 'isViewer', 'Translations',
        function ($scope, $rootScope, $mdDialog, Dealer, tab, isViewer, Translations) {

            var SIGN_UP_TAB_INDEX = 0;
            var LOG_IN_TAB_INDEX = 1;

            $scope.selectedTab = tab; // 0 - Sign Up; 1 - Log In;
            $scope.selectedOperation = tab;
            $scope.datepicker = {
                opened: false,
                options: {
                    formatYear: 'yyyy',
                    maxDate: new Date(),
                    showWeeks: false
                }
            };
            $scope.maxDate = new Date();
            $scope.logIn = {};
            $scope.dealer = {
                full_name: "",
                email: "",
                user: {
                    username: "",
                    password: ""
                },
                date_of_birth: null,
                gender: "",
                register_date: null,
                role: "Viewer"
            };

            hideError();
            setBroadcastListeners();

            $scope.signUp = function (form) {
                if (!form.$valid) {
                    showError(Translations.signIn.invalidFields);
                    return;
                } else {
                    $scope.showError = false;
                    $scope.buttonTitle = Translations.signIn.loading;
                }
                var dealer = $scope.dealer;
                var subEmail = dealer.email;
                if (subEmail > 30) {
                    dealer.user.username = subEmail.substring(0, 30);
                } else {
                    dealer.user.username = subEmail;
                }
                if (!dealer.gender) {
                    dealer.gender = "Unspecified";
                }
                dealer.bank_accounts = [];
                dealer.credit_cards = [];
                dealer.register_date = new Date();
                Dealer.create(dealer);
            };

            $scope.logIn = function (form) {
                if (!form.$valid) {
                    if (!form.email.$viewValue || form.email.$viewValue === "") {
                        showError(Translations.signIn.blankEmail);
                    } else if (form.email.$invalid) {
                        showError(Translations.signIn.invalidEmail);
                    } else if (!form.password.$viewValue || form.password.$viewValue === "") {
                        showError(Translations.signIn.blankPassword);
                    } else {
                        showError(Translations.signIn.invalidFields);
                    }
                    return;
                } else {
                    $scope.showError = false;
                    $scope.buttonTitle = Translations.signIn.loading;
                }

                Dealer.logIn($scope.logIn.email, $scope.logIn.password);
            };

            $scope.submit = function (event, signUpForm, logInForm) {
                if ($scope.selectedTab == SIGN_UP_TAB_INDEX) {
                    $scope.signUp(signUpForm);
                } else {
                    $scope.logIn(logInForm);
                }
            };

            $scope.onTabSelected = function (tab) {
                if (tab == SIGN_UP_TAB_INDEX) {
                    $scope.buttonTitle = Translations.signIn.signUpButtonTitle;
                    if (isViewer) {
                        ga('send', 'pageview', '/viewer-sign-up');
                    } else {
                        ga('send', 'pageview', '/dealer-sign-up');
                    }
                } else {
                    $scope.buttonTitle = Translations.signIn.logInButtonTitle;
                    ga('send', 'pageview', '/log-in');
                }
            };

            function showError(message) {
                if ($scope.selectedTab == SIGN_UP_TAB_INDEX) {
                    $scope.buttonTitle = Translations.signIn.signUpButtonTitle;
                } else {
                    $scope.buttonTitle = Translations.signIn.logInButtonTitle;
                }
                $scope.errorMessage = message;
                $scope.showError = true;
            }

            function hideError() {
                if ($scope.selectedTab == SIGN_UP_TAB_INDEX) {
                    $scope.buttonTitle = Translations.signIn.signUpButtonTitle;
                } else {
                    $scope.buttonTitle = Translations.signIn.logInButtonTitle;
                }
                $scope.errorMessage = "";
                $scope.showError = false;
            }

            function setBroadcastListeners() {

                // When sign up is done
                $scope.$on('sign-up', function (event, args) {
                    if (args.success) {
                        console.log("User has signed up successfully!");
                        $scope.selectedOperation = 0;
                    } else {
                        var message = args.message.data;
                        if (message.detail) {
                            showError(message.detail);
                        } else if (message.user[0].username[0]) {
                            showError(message.user[0].username[0]);
                        } else {
                            showError(message);
                        }
                    }
                });

                // When the log in is done
                $scope.$on('log-in', function (event, args) {
                    if (args.success) {
                        console.log("User has logged in successfully!");
                        $scope.selectedOperation = 1;
                    } else {
                        var message = args.message.data.detail;
                        showError(message);
                    }
                });

                // When the credentials are set in the default header of the $http service.
                $scope.$on('credentials-set', function (event, args) {
                    if (args.success) {
                        hideError();
                        $scope.enter($scope.selectedOperation);
                    } else {
                        console.log("Couldn't get token: " + String(args.message));
                        showError(Translations.signIn.generalProblem);
                    }
                });
            }

            /**
             * Opens the datepicker pop up.
             * @param event - the event that triggered the opening.
             */
            $scope.openDatepicker = function (event) {
                $scope.datepicker.opened = true;
            };

            /**
             * Enters the system with the finished operation received as an argument.
             * @param op - The finished operation.
             */
            $scope.enter = function (op) {
                $rootScope.setUserProfilePic();
                Dealer.setIntercom($rootScope.dealer);
                $scope.hide(op);
            };

            $scope.hide = function (op) {
                $mdDialog.hide(op);
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };
        }]);
