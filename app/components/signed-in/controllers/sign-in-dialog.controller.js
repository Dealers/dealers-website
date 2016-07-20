/**
 * Created by gullumbroso on 22/04/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
    /**
     * The controller that is responsible for dialogs's behaviour.
     * @param $scope - the isolated scope of the controller.
     * @param $mdDialog - the mdDialog service of the Material Angular library.
     */
        .controller('SignInDialogController', ['$scope', '$rootScope', '$mdDialog', 'Dealer', 'tab',
            function ($scope, $rootScope, $mdDialog, Dealer, tab) {

                var SIGN_UP_TAB_INDEX = 0;
                var LOG_IN_TAB_INDEX = 1;
                var SIGN_UP_BUTTON_TITLE = "Sign Up!";
                var LOG_IN_BUTTON_TITLE = "Log In";

                $scope.selectedTab = tab; // 0 - Sign Up; 1 - Log In;
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
                        showError("Not all fields are valid!");
                        return;
                    } else {
                        $scope.showError = false;
                        $scope.buttonTitle = "Loading...";
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
                            showError("Please enter your email!");
                        } else if (form.email.$invalid) {
                            showError("The email you entered is not valid");
                        } else if (!form.password.$viewValue || form.password.$viewValue === "") {
                            showError("Please enter your password!");
                        } else {
                            showError("There are unvalid fields!");
                        }
                        return;
                    } else {
                        $scope.showError = false;
                        $scope.buttonTitle = "Loading...";
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
                        $scope.buttonTitle = SIGN_UP_BUTTON_TITLE;
                    } else {
                        $scope.buttonTitle = LOG_IN_BUTTON_TITLE;
                    }
                };

                function showError(message) {
                    if ($scope.selectedTab == SIGN_UP_TAB_INDEX) {
                        $scope.buttonTitle = SIGN_UP_BUTTON_TITLE;
                    } else {
                        $scope.buttonTitle = LOG_IN_BUTTON_TITLE;
                    }
                    $scope.errorMessage = message;
                    $scope.showError = true;
                }

                function hideError() {
                    if ($scope.selectedTab == SIGN_UP_TAB_INDEX) {
                        $scope.buttonTitle = SIGN_UP_BUTTON_TITLE;
                    } else {
                        $scope.buttonTitle = LOG_IN_BUTTON_TITLE;
                    }
                    $scope.errorMessage = "";
                    $scope.showError = false;
                }

                function setBroadcastListeners() {

                    // When sign up is done
                    $scope.$on('sign-up', function (event, args) {
                        if (args.success) {
                            console.log("User has signed up successfully!");
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
                        } else {
                            var message = args.message.data.detail;
                            showError(message);
                        }
                    });

                    // When the credentials are set in the default header of the $http service.
                    $scope.$on('credentials-set', function (event, args) {
                        if (args.success) {
                            hideError();
                            $scope.enter();
                        } else {
                            console.log("Couldn't get token: " + String(args.message));
                            showError("There was a problem. Please try again");
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

                $scope.enter = function () {
                    $rootScope.setUserProfilePic();
                    Dealer.setIntercom($rootScope.dealer);
                    $scope.hide();
                };

                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            }]);
})();