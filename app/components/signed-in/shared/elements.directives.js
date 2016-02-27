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
	.directive('dlDeal', ['$location', 'ActiveSession', 'DealInfo', 'DealPhotos', 'DealerPhotos', 
			function($location, ActiveSession, DealInfo, DealPhotos, DealerPhotos) {
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
					scope.dealImage = "";
					scope.imageHeight = 0.678125 * element.find('.deal').width(); // Calculate the height of the image placeholder according to the ratio 0.678125.
					DealPhotos.getPhoto(deal.photo1, deal.id);
					scope.dealImageStatus = "loading";
				} else {
					scope.imageBackgroundColor = DealPhotos.colorForNum(deal.photo1);
				}
				scope.$on('downloaded-photo-' + deal.id, function(event, args) {
	          		if (args.success) {
	          			scope.dealImage = args.data;
	          			scope.dealImageStatus = "doneLoading";
	          			scope.$apply();
	          		} else {
						console.log(args.message);
	          		}
	        	});  
	        	
	        	// Dealer Photo
	        	scope.hasProfilePic = DealerPhotos.hasProfilePic(scope.deal.dealer.photo);
	        	var sender = 'deal-grid';
	        	if (scope.hasProfilePic) {
	        		scope.profilePic = "";
	        		DealerPhotos.getPhoto(scope.deal.dealer.photo, scope.deal.dealer.id, sender);
	        		scope.profilePicStatus = "loading";
	        	}
	        	scope.$on('downloaded-' + sender + '-profile-pic-' + scope.deal.dealer.id, function(event, args) {
	          		if (args.success) {
	          			scope.profilePic = args.data;
	          			scope.profilePicStatus = "doneLoading";
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
				
				scope.viewDeal = function(deal) {
				/*
				 * Takes the user to the deal's View Deal page.
				 */
					ActiveSession.setTempData(deal);
					$location.path('/deals/' + String(deal.id));
				};
			}
		};
	}])
	.directive('dlComment', ['DealerPhotos',
			function(DealerPhotos) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				comment: '='
			},
			templateUrl: 'app/components/signed-in/shared/comment.view.html',
			link: function(scope, element) {
				
	        	// Dealer Photo
	        	scope.hasProfilePic = DealerPhotos.hasProfilePic(scope.comment.dealer.photo);
	        	var sender = 'comment';
	        	if (scope.hasProfilePic) {
	        		scope.commenterPhoto = "";
	        		DealerPhotos.getPhoto(scope.comment.dealer.photo, scope.comment.dealer.id, sender);
	        		scope.profilePicStatus = "loading";
	        	}
	        	scope.$on('downloaded-' + sender + '-profile-pic-' + scope.comment.dealer.id, function(event, args) {
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
