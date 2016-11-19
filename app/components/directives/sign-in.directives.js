var REGISTER_PATH = "/register/basic-info";

angular.module('DealersApp')
    .directive('getStarted', function () {
        return {
            restrict: 'E',
            scope: {
                style: '='
            },
            templateUrl: 'app/components/views/sign-in/get-started.view.html',
            controller: function ($scope, $location, Dealer, Dialogs) {
                $scope.subscribe = function (event) {
                    Dealer.subscribe($scope.email);
                    Dialogs.showSignUpViewerDialog(event, $scope.email)
                        .then(function (finished) {
                            // Finished the sign up process
                            if (finished == 0) {
                                $location.path(REGISTER_PATH);
                            }
                        });
                };
                $scope.$on('subscribed', function (event, args) {
                    var success = args.success;
                    var subscriber = args.message;
                    if (success) {
                        console.log("Listed in subscribers successfully.");
                    } else {
                        console.log("Email already listed in subscribers.");
                    }
                });
            },
            link: function (scope, element) {
                if (scope.style == 'white') {
                    var button = $(element).find('button.md-button.get-started');
                    button.addClass('btn-white');
                }
            }
        };
    })
    /**
     * Register As Dealer button.
     */
    .directive('registerAsDealer', ['$rootScope', '$location', '$mdMedia', '$mdDialog',
        function ($rootScope, $location, $mdMedia, $mdDialog) {
            return {
                link: function (scope, element) {
                    scope.customFullscreen = $mdMedia('xs');

                    /**
                     * Presents the sign in dialog (sign up and log in).
                     * @param ev - The event that triggered the function.
                     * @param tabIndex - the index of the selected option (sign up is 0, log in is 1).
                     */
                    scope.showSignInDialog = function (ev, tabIndex) {
                        $mdDialog.show({
                            controller: 'SignInDialogController',
                            templateUrl: 'app/components/views/sign-in/sign-in-dealer-dialog.view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            fullscreen: scope.customFullscreen,
                            locals: {tab: tabIndex, isViewer: false, email: null}
                        })
                            .then(function (finished) {
                                // Finished the sign in process
                                if (finished == 0) {
                                    $location.path(REGISTER_PATH);
                                } else if (finished == 1) {
                                    $location.path("/home");
                                } else {
                                    console.error("Received something wrong to the callback of showSignInDialog");
                                }
                            });
                    };

                    /**
                     * Takes the user to the register-as-dealer page. If he is not signed in, takes him through the sign in process first.
                     * @param ev - the event that triggered the function.
                     */
                    $(element).on("click", function (ev) {
                        if ($rootScope.dealer) {
                            $location.path(REGISTER_PATH);
                            scope.$apply();
                        } else {
                            if ($(element).is("#nav-login")) {
                                scope.showSignInDialog(ev, 1, false);
                            } else {
                                scope.showSignInDialog(ev, 0, true);
                            }
                        }
                    });
                }
            };
        }])
    .directive('signUpViewerForm', function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'app/components/views/sign-in/sign-up-viewer-form.view.html'
        }
    });