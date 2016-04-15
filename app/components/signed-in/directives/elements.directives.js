(function () {
    'use strict';

	angular.module('DealersApp')
	.directive('dlNavbar', ['$location', '$routeParams', '$rootScope', 'Dealer', function($location, $routeParams, $rootScope, Dealer) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/signed-in/views/navbar.view.html',
			link: function(scope, element) {
				
				scope.dealer = $rootScope.dealer;
				scope.searchTerm = {};
				scope.catDropdownDisplay = false;
				scope.userProfilePic = $rootScope.userProfilePic;
				scope.elements = scope.categories;
				scope.categoriesTemplate = 'categories';
				
				if (!$rootScope.userProfilePic) {
					waitForProfilePic();
				} else {
					scope.userProfilePic = $rootScope.userProfilePic;
				}
				
				var currentPath = $location.path().split("/")[1];
				if (currentPath == "search") {
					scope.searchTerm.text = $routeParams.query;
				}
				scope.search = function(form) {
					/**
					 * Takes the user to the deal's View Deal page.
					 */
					$location.path('/search/deals/' + scope.searchTerm.text);
				};
				scope.toggleCatDropdown = function() {
					/**
					 * Toggles the category dropdown menu
					 */
					if (scope.catDropdownDisplay) {
						scope.catDropdownDisplay = false;
					} else {
						scope.catDropdownDisplay = true;
					}
				};
				function waitForProfilePic() {
					scope.$on('downloaded-' + $rootScope.userProfilePicSender + '-profile-pic-' + $rootScope.dealer.id, function(event, args) {
			      		if (args.success) {
			      			scope.userProfilePic = args.data;
			      		} else {
			      			scope.userProfilePic = null;
							console.log(args.message);
			      		}
			    	});
				}
				
			}
		};
	}])
	.directive('apNavbar', ['$location', '$routeParams', '$rootScope', 'AddProduct', function($location, $routeParams, $rootScope, AddProduct) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/components/signed-in/views/add-product-navbar.view.html',
			link: function(scope, element) {
				
				const basePath = '/new-product';

				/**
				 * The user clicked on a breadcrumb link, Check if valid and if so move to that link.
				 */
				scope.moveTo = function(path) {
					if (scope.phase1Valid) {
						$location.path(basePath + path);
					}
				};

				/**
				 * Sets the appearance of the links in the breadcrumb.
				 */
				scope.checkPhase = function(path) {
                    var phase = $location.url();
					// return phase != basePath + path;
                    if (phase == "/basic-info") {
                        
                    }
				};
			}
		};
	}])
	.directive('dlCategory', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				category: '='
			},
			template: '<a href="/#/categories/{{category}}"><li>{{category}}</li></a>'
		};
	})
	.directive('dlDeal', ['$location', 'ActiveSession', 'Deal', 'DealPhotos', 'DealerPhotos', 
			function($location, ActiveSession, Deal, DealPhotos, DealerPhotos) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				deal: '='
			},
			templateUrl: 'app/components/signed-in/views/deal-cell.view.html',
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
					scope.dealCur = Deal.currencyForKey(deal.currency);
				}
				scope.discountTypePP = deal.discountType === "PP";
				scope.hasLikes = deal.dealattribs.dealers_that_liked.length > 0;
				
				scope.viewDeal = function(deal) {
				/**
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
			templateUrl: 'app/components/signed-in/views/comment.view.html',
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
