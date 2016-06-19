(function () {
    'use strict';

    angular.module('DealersApp')
        .directive('intro', function() {
            return {
                restrict: 'E',
                templateUrl: 'app/components/signed-in/views/about/intro-section.view.html'
            };
        })
        .directive('sellWithDealers', function() {
            return {
                restrict: 'E',
                templateUrl: 'app/components/signed-in/views/about/sell-with-dealers.view.html'
            }
        })
        .directive('findOutMore', function() {
            return {
                templateUrl: 'app/components/signed-out/shared/find-out-more.view.html',
                link: function(scope, element) {
                    // jQuery for page scrolling feature - requires jQuery Easing plugin
                    element.bind('click', function(event) {
                        var $anchor = element.find('a');
                        $('html, body').stop().animate({
                            scrollTop: ($($anchor.attr('href')).offset().top)
                        }, 1250, 'easeInOutExpo');
                        event.preventDefault();
                    });
                }
            };
        })
        .directive('aboutSection', function() {
            return {
                restrict: 'E',
                templateUrl: 'app/components/signed-out/shared/about-section.view.html'
            };
        })
        .directive('iosSection', function() {
            return {
                restrict: 'E',
                templateUrl: 'app/components/signed-out/shared/ios-section.view.html'
            };
        })
        .directive('footerSection', function() {
            return {
                restrict: 'E',
                templateUrl: 'app/components/signed-out/shared/footer-section.view.html'
            };
        });
})();
