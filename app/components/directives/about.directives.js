angular.module('DealersApp')
    .directive('intro', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/intro-section.view.html',
            link: function (scope, element) {
                var navbar = $("nav.navbar");
                var navShadeClass = "navbar-shade";
                if (scope.isHomePage && scope.role == scope.roles.guest) {
                    navbar.removeClass(navShadeClass);
                    $(window).scroll(function () {
                        var scroll = $(window).scrollTop();
                        if (scroll >= 30) {
                            navbar.addClass(navShadeClass);
                        } else {
                            navbar.removeClass(navShadeClass);
                        }
                    });
                }
                scope.$on('$destroy', function () {
                    $(window).off("scroll");
                });
            }
        };
    })
    .directive('sellWithDealers', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/sell-with-dealers.view.html'
        }
    })
    .directive('findOutMore', function () {
        return {
            templateUrl: 'app/components/signed-out/shared/find-out-more.view.html',
            link: function (scope, element) {
                // jQuery for page scrolling feature - requires jQuery Easing plugin
                element.bind('click', function (event) {
                    var $anchor = element.find('a');
                    $('html, body').stop().animate({
                        scrollTop: ($($anchor.attr('href')).offset().top)
                    }, 1250, 'easeInOutExpo');
                    event.preventDefault();
                });
            }
        };
    })
    .directive('aboutSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/about-section.view.html'
        };
    })
    .directive('iosSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/signed-out/shared/ios-section.view.html'
        };
    })
    .directive('footerSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/footer-section.view.html'
        };
    })
    .directive('menuFooter', function () {

        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/menu-footer.view.html'
        };
    });