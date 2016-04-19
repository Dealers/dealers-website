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
					 * Takes the user to the product's View Deal page.
					 */
					$location.path('/search/products/' + scope.searchTerm.text);
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
	.directive('dlProduct', ['$location', 'ActiveSession', 'Product', 'ProductPhotos', 'DealerPhotos', 
			function($location, ActiveSession, Product, ProductPhotos, DealerPhotos) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				product: '='
			},
			templateUrl: 'app/components/signed-in/views/product-cell.view.html',
			link: function(scope, element) {

                const DEFAULT_PHOTO_RATIO = 0.678125;

				var product = scope.product;
				
				// Product Photo
				scope.hasPhoto = product.photo1.length > 2;

                var ratio = DEFAULT_PHOTO_RATIO;
                if (product.main_photo_width && product.main_photo_height) {
                    ratio = product.main_photo_height / product.main_photo_width;
                }

				if (scope.hasPhoto) {
					scope.productImage = "";
					scope.imageHeight = ratio * element.find('.product').width(); // Calculate the height of the image placeholder according to the ratio 0.678125.
					ProductPhotos.downloadPhoto(product.photo1, product.id);
					scope.productImageStatus = "loading";
				} else {
					scope.imageBackgroundColor = ProductPhotos.colorForNum(product.photo1);
				}
				scope.$on('downloaded-photo-' + product.id, function(event, args) {
	          		if (args.success) {
	          			scope.productImage = args.data.url;
	          			scope.productImageStatus = "doneLoading";
	          			scope.$apply();
	          		} else {
						console.log(args.data.message);
	          		}
	        	});  
	        	
	        	// Dealer Photo
	        	scope.hasProfilePic = DealerPhotos.hasProfilePic(scope.product.dealer.photo);
	        	var sender = 'product-grid';
	        	if (scope.hasProfilePic) {
	        		scope.profilePic = "";
	        		DealerPhotos.getPhoto(scope.product.dealer.photo, scope.product.dealer.id, sender);
	        		scope.profilePicStatus = "loading";
	        	}
	        	scope.$on('downloaded-' + sender + '-profile-pic-' + scope.product.dealer.id, function(event, args) {
	          		if (args.success) {
	          			scope.profilePic = args.data;
	          			scope.profilePicStatus = "doneLoading";
	          			scope.$apply();
	          		} else {
						console.log(args.message);
	          		}
	        	});
	        	
	        	// Other info
				if (product.currency) {
					scope.productCur = Product.currencyForKey(product.currency);
				}
				scope.discountTypePP = product.discount_type === "123";
				scope.hasLikes = product.dealattribs.dealers_that_liked.length > 0;
				
				scope.viewDeal = function(product) {
				/**
				 * Takes the user to the product's View Deal page.
				 */
					ActiveSession.setTempData(product);
					$location.path('/products/' + String(product.id));
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
