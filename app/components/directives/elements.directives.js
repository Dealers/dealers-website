angular.module('DealersApp')
    .directive('dlNavbar', ['$location', '$routeParams', '$rootScope', 'Dealer', function ($location, $routeParams, $rootScope, Dealer) {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/navbar.view.html',
            controller: 'NavbarController',
            link: function (scope, element) {
            }
        };
    }])
    .directive('dlCategory', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                category: '='
            },
            template: '<a href="/categories/{{category}}"><li>{{category}}</li></a>'
        };
    })
    .directive('vdInfoPane', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/views/view-deal-info-pane.view.html'
        };
    })
    .directive('minimizable', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                text: "=",
                maxHeight: "="
            },
            templateUrl: 'app/components/views/minimizable.view.html',
            link: function ($scope, element) {

                var div = $(element).find(".mini-container");
                div.css("opacity", 0);
                $scope.present = false;
                $scope.needMinimize = false;

                $scope.$watch('text', function () {
                    $timeout(function () {
                        if ($scope.text) {
                            if ($scope.text.length > 0) {
                                if (div.height() > $scope.maxHeight + 40) {
                                    // Checks if need minimization.
                                    $scope.activateMinimization();
                                }
                                div.css("opacity", 1.0);
                            }
                        }
                    }, 100);
                });

                $scope.activateMinimization = function () {
                    $scope.needMinimize = true;
                    div.css("max-height", $scope.maxHeight);
                    div.addClass("animate-height");
                    // $timeout(function () {
                    //
                    // }, 100);
                };

                $scope.toggle = function (event) {
                    if ($scope.present) {
                        div.css("max-height", $scope.maxHeight);
                        $scope.present = false;
                    } else {
                        div.css("max-height", "2000px");
                        $scope.present = true;
                    }
                }
            }
        };
    }])
    .directive('securePayment', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/secure-payment.view.html'
        };
    })
    .directive('dlComment', ['DealerPhotos',
        function (DealerPhotos) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    comment: '='
                },
                templateUrl: 'app/components/views/comment.view.html',
                link: function (scope, element) {

                    // Dealer Photo
                    scope.hasProfilePic = DealerPhotos.hasProfilePic(scope.comment.dealer.photo);
                    var sender = 'comment';
                    if (scope.hasProfilePic) {
                        scope.commenterPhoto = "";
                        DealerPhotos.getPhoto(scope.comment.dealer.photo, scope.comment.dealer.id, sender);
                        scope.profilePicStatus = "loading";
                    }
                    scope.$on('downloaded-' + sender + '-dealer-pic-' + scope.comment.dealer.id, function (event, args) {
                        if (args.success) {
                            scope.commenterPhoto = args.data;
                            scope.profilePicStatus = "doneLoading";
                            scope.$apply();
                        } else {
                            console.log(args.message);
                        }
                    });
                }
            };
        }]);