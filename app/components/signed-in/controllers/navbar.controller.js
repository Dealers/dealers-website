/**
 * Created by gullumbroso on 21/04/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
        /**
         * Manages the navigation bar and its presentation according to the user's role.
         */
        .controller('NavbarController', ['$scope', '$rootScope', '$location', '$routeParams', '$mdMedia', '$mdMenu', '$mdDialog',
            function ($scope, $rootScope, $location, $routeParams, $mdMedia, $mdMenu, $mdDialog) {

                $scope.dealer = $rootScope.dealer;
                $scope.searchTerm = {};
                $scope.catDropdownDisplay = false;
                $scope.userProfilePic = $rootScope.userProfilePic;
                $scope.mode = ""; // Guest, Viewer, Dealer or Admin
                $scope.phoneMode = false;
                $scope.searchBarPresented = false;
                $scope.customFullscreen = $mdMedia('xs');

                determineMode();
                setMediaQueryWatchers();

                if ($scope.mode != $scope.roles.guest) {
                    if (!$rootScope.userProfilePic) {
                        waitForProfilePic();
                    } else {
                        $scope.userProfilePic = $rootScope.userProfilePic;
                    }
                }

                var currentPath = $location.path().split("/")[1];
                if (currentPath == "search") {
                    $scope.searchTerm.text = $routeParams.query;
                }

                /**
                 * Determines the mode of the navigation bar according to the user's role. Can be Guest mode, Viewer mode or Dealer mode.
                 */
                function determineMode() {
                    if (!$scope.dealer) {
                        $scope.mode = $scope.roles.guest;
                    } else if ($scope.dealer.role == $scope.roles.admin) {
                        $scope.mode = $scope.roles.dealer;
                    } else {
                        $scope.mode = $scope.dealer.role;
                    }
                }

                function setMediaQueryWatchers() {
                    $scope.$watch(function () {
                        return $mdMedia('xs');
                    }, function (isPhone) {
                        $scope.phoneMode = isPhone;
                    });
                }

                /**
                 * Toggles the presentation of the navigation bar's search bar.
                 * @param event - the event that triggered the function.
                 */
                $scope.toggleSearchBar = function (event) {
                    $scope.searchBarPresented = !$scope.searchBarPresented;
                };

                /**
                 * Toggles an angular-material dropdown menu.
                 * @param $mdOpenMenu - the menu to open.
                 * @param $mdMenuIsOpen - a boolean value indicating if the menu is open.
                 * @param ev - the event that triggered the function.
                 */
                $scope.toggleMenu = function ($mdOpenMenu, $mdMenuIsOpen, ev) {
                    if ($mdMenuIsOpen) {
                        $mdMenu.hide();
                    } else {
                        $mdOpenMenu(ev);
                    }

                };

                /**
                 * Takes the user to the product's View Deal page.
                 */
                $scope.search = function (form) {
                    $location.path('/search/products/' + $scope.searchTerm.text);
                };

                /**
                 * Waits for the root scope to broadcast the user's profile pic.
                 */
                function waitForProfilePic() {
                    $scope.$on('downloaded-' + $rootScope.userProfilePicSender + '-profile-pic-' + $rootScope.dealer.id, function (event, args) {
                        if (args.success) {
                            $scope.userProfilePic = args.data;
                        } else {
                            $scope.userProfilePic = null;
                            console.log(args.message);
                        }
                    });
                }

                /**
                 * Presents the sign in dialog (sign up and log in).
                 * @param ev - The event that triggered the function.
                 * @param tabIndex - the index of the selected option (sign up is 0, log in is 1).
                 * @param registerCallback - a boolean indicating if the sign in is part of the register-as-dealer process.
                 */
                $scope.showSignInDialog = function (ev, tabIndex, registerCallback) {
                    $mdDialog.show({
                            controller: 'SignInDialogController',
                            templateUrl: 'app/components/signed-in/views/sign-in/sign-in-dialog.view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: $scope.customFullscreen,
                            locals: {tab: tabIndex}
                        })
                        .then(function (finished) {
                            // Finished the sign in process
                            if (registerCallback) {
                                $location.path("/register");
                            } else {
                                $location.path("/home");
                            }
                        });
                };

                /**
                 * Takes the user to the register-as-dealer page. If he is not signed in, takes him through the sign in process first.
                 * @param ev - the event that triggered the function.
                 */
                $scope.registerAsDealer = function (ev) {
                    if ($rootScope.dealer) {
                        $location.path("/register");
                    } else {
                        $scope.showSignInDialog(ev, 0, true);
                    }
                };
            }]);
})();