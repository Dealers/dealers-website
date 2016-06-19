(function () {
    'use strict';

    angular.module('DealersApp')
        .directive('dlNavbar', ['$location', '$routeParams', '$rootScope', 'Dealer', function ($location, $routeParams, $rootScope, Dealer) {
            return {
                restrict: 'E',
                templateUrl: 'app/components/signed-in/views/navbar.view.html',
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
                template: '<a href="/#/categories/{{category}}"><li>{{category}}</li></a>'
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
                    templateUrl: 'app/components/signed-in/views/comment.view.html',
                    link: function (scope, element) {

                        // Dealer Photo
                        scope.hasProfilePic = DealerPhotos.hasProfilePic(scope.comment.dealer.photo);
                        var sender = 'comment';
                        if (scope.hasProfilePic) {
                            scope.commenterPhoto = "";
                            DealerPhotos.getPhoto(scope.comment.dealer.photo, scope.comment.dealer.id, sender);
                            scope.profilePicStatus = "loading";
                        }
                        scope.$on('downloaded-' + sender + '-profile-pic-' + scope.comment.dealer.id, function (event, args) {
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
})();
