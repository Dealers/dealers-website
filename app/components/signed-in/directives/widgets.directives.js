(function () {
    'use strict';

	angular.module('DealersApp')
	.directive('likeButton', ['$rootScope', '$http', 'Product', function($rootScope, $http, Product) {
		return {
			link: function(scope, element) {
				
				// First of all check if the scope is defined properly
				if (!scope.product) {
					console.log("There's a problem - the parent scope doesn't have a product attribute.");
					return;
				}
				
				var dealerID = $rootScope.dealer.id;
				var dealersThatLiked = scope.product.dealattribs.dealers_that_liked;
				updateLikeAppearance();
				
				function isLiked() {
					/*
					 * Check if the user liked this product, if so, mark the button.
					 */
					var likedByUser = $.inArray(dealerID, dealersThatLiked);
					if (likedByUser == -1) {
						// The user didn't like the product before, should like it now.
						return false;
					}
					return true;
				};
								
				function updateLikeAppearance() {
					/*
					 * If the user liked the product, unmark it. If he didn't, mark it.
					 */
					if (isLiked()) {
						element.css('background-color', '#9C27B0').css('color', 'white').contents().last().replaceWith(" Unlike");					
					} else {
						element.css('background-color', 'white').css('color', '#9C27B0').contents().last().replaceWith(" Like");
					}
				}
				
				scope.likeClicked = function likeClicked() {
					/*
					 * The user clicked the like button
					 */
					if (isLiked()) {
						// Remove the user from the dealersThatLiked array and update the appearance when done.
						var index = dealersThatLiked.indexOf(dealerID);
						if (index > -1) {
						    dealersThatLiked.splice(index, 1);
						}
					} else {
						// Add the user to the dealersThatLiked array and update the appearance when done.
						dealersThatLiked.push(dealerID);
					}
					$http.patch($rootScope.baseUrl + '/dealattribs/' + scope.product.dealattribs.id + '/', scope.product.dealattribs)
					.then(function (response) {
			            // success
			            console.log("Like was updated 	successfully!");
			            scope.product.dealattribs = response.data;
			            updateLikeAppearance();
	          			// scope.$apply();
			        },
			        function (httpError) {
			          	// error
			          	console.log(httpError.status + " : " + httpError.data);
			        });
				};
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
	.directive('scrollDetector', ['Product', function(Product) {
		return {
			link: function(scope, element) {
				$(window).scroll(function() {
				   if($(window).scrollTop() + $(window).height() > $(document).height() - 700) {
				   		if (!scope.update.loadingMore) {
				   			if (scope.update.nextPage) {
				   				console.log("Loading more products");
				   				scope.update.loadingMore = true;
				   				scope.$apply();
				   				scope.getProducts(scope.update.nextPage);
				   			}
				   		}
				   }
				});
				scope.$on('$destroy', function() {
                    $(window).off("scroll");
				});
			}
		};
	}]);
})();
