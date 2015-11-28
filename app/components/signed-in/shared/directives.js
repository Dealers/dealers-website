(function () {
    'use strict';

	angular.module('DealersApp')
	.directive('dlNavbar', ['$location', '$rootScope', 'Dealer', function($location, $rootScope, Dealer) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/signed-in/shared/navbar.view.html',
			link: function(scope, element) {
				scope.dealer = $rootScope.dealer;
				scope.logOut = function () {
					Dealer.logOut();
					$location.path('/');
				};
			}
		};
	}])
	.directive('dlDeal', ['DealInfo', 'DealPhotos', function(DealInfo, DealPhotos) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				deal: '='
			},
			templateUrl: 'app/components/signed-in/shared/deal-cell.view.html',
			link: function(scope, element) {
				
				var deal = scope.deal;
				
				// Deal Photo
				scope.hasPhoto = deal.photo1.length > 2;
				if (scope.hasPhoto) {
					DealPhotos.getPhoto(deal.photo1, deal.id);
					scope.dealImageStatus = "loading";
				} else {
					scope.imageBackgroundColor = DealPhotos.colorForNum(deal.photo1);
				}
				scope.$on('downloaded-photo-' + deal.id, function(event, args) {
	          		if (args.success) {
	          			scope.photoSrc = args.data;
	          			scope.dealImageStatus = "doneLoading";
	          			scope.$apply();
	          		} else {
						console.log(args.message);
	          		}
	        	});  
	        	
	        	// Other info
				if (deal.currency) {
					scope.dealCur = DealInfo.currencyForKey(deal.currency);
				}
				scope.discountTypePP = deal.discount_type === "PP";
				scope.hasLikes = deal.dealattribs.dealers_that_liked.length > 0;
			}
		};
	}])
	.directive('loadingSpinner', function() {
		return {
			restrict: 'E',
			scope: {
				size: '@'
			},
			template: "<div class='spinnerContainer'></div>",
			link: function(scope, element) {
			  	var container = element[0].children[0];
				var scale = 0.25;
				if (scope.size === "small") {
					scale = 0.16;
				}
				var opts = {
				  lines: 13 // The number of lines to draw
				, length: 28 // The length of each line
				, width: 14 // The line thickness
				, radius: 42 // The radius of the inner circle
				, scale: scale // Scales overall size of the spinner
				, corners: 1 // Corner roundness (0..1)
				, color: 'rgb(100,100,115)' // #rgb or #rrggbb or array of colors
				, opacity: 0.25 // Opacity of the lines
				, rotate: 0 // The rotation offset
				, direction: 1 // 1: clockwise, -1: counterclockwise
				, speed: 1.2 // Rounds per second
				, trail: 60 // Afterglow percentage
				, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
				, zIndex: 2e9 // The z-index (defaults to 2000000000)
				, className: 'spinner' // The CSS class to assign to the spinner
				, top: '50%' // Top position relative to parent
				, left: '50%' // Left position relative to parent
				, shadow: false // Whether to render a shadow
				, hwaccel: false // Whether to use hardware acceleration
				, position: 'absolute' // Element positioning
				};
				var spinner = new Spinner(opts).spin(container);
			}
		};
	})
	.directive('scrollDetector', ['Deal', function(Deal) {
		return {
			link: function(scope, element) {
				$(window).scroll(function() {
				   if($(window).scrollTop() + $(window).height() > $(document).height() - 700) {
				   		if (!scope.update.loadingMore) {
				   			if (scope.update.nextPage) {
				   				console.log("Loading more deals");
				   				scope.update.loadingMore = true;
				   				scope.$apply();
				   				scope.getDeals(scope.update.nextPage);
				   			}
				   		}
				   }
				});
			}
		};
	}]);
})();
