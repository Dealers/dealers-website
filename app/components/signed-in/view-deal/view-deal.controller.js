(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('ViewDealController', 
		['$scope', '$rootScope', '$http', '$routeParams', 'Deal', 'DealPhotos', 'DealerPhotos', 'ActiveSession', 
			function($scope, $rootScope, $http, $routeParams, Deal, DealPhotos, DealerPhotos, ActiveSession) {
		
		var ctrl = this;
		
		$scope.deal = {};
		$scope.status = 'loading';
		$scope.dealImageStatus = 'loading';
		$scope.profilePicStatus = 'loading';
		$scope.hasPhoto = false;
		$scope.hasProfilePic = false;
		$scope.user = $rootScope.dealer;
		$scope.discountTypePP;
		$scope.totalLikes = 0;
		
		$scope.userProfilePic = null;
		$scope.commentPlaceholder = "";
		$scope.comment = {};
		$scope.showCommentError = false;
		$scope.commentErrorMessage = "Oops! Comment can't be blank!";
		$scope.showCommentButton = false;
		
		$scope.addComment = addComment;
		$scope.presentCommentError = presentCommentError;
		
		$scope.deal = ActiveSession.getTempData(); // Retreives the deal from the Active Session service.
		if (!$scope.deal.id) {
			// There is no deal in the session, download it form the server.
			downloadDeal();
		} else {
			$scope.status = 'downloaded';
			fillData();
		}
		
		function downloadDeal() {
			var dealID = $routeParams.dealID;
			Deal.getDeal(dealID)
			.then(function (result) {
				$scope.status = 'downloaded';
				$scope.deal = result.data;
				mapDealData();
				fillData();
			}, function (httpError) {
				$scope.status = 'failed';
				$scope.errorMessage = "Couldn't download the deal";
				$scope.errorPrompt =  "Please try again...";
			});
		}
		
		function fillData() {
			/*
			 * Injects the deal's data in the view.
			 */
			setDealPhoto();
			setDealerProfile();
			$scope.discountTypePP = $scope.deal.discount_type === "PP";
			$scope.totalLikes = $scope.deal.dealattribs.dealers_that_liked.length;
			
			// Comments
			if (!$rootScope.userProfilePic) {
				waitForProfilePic();
			} else {
				$scope.userProfilePic = $rootScope.userProfilePic;
			}
			if ($scope.deal.comments.length > 1) {
				$scope.commentPlaceholder = "Add a comment...";
			} else {
				$scope.commentPlaceholder = "Be the first to comment...";
			}
		}

		function setDealPhoto() {
			/*
			 * Takes care of presenting the photo if exists, and handle it gracefully if not.
			 */
			var photo = $scope.deal.photo1;
			if ($scope.deal.photo) {
				$scope.hasPhoto = true;
				$scope.dealImageStatus = 'doneLoading';
			} else if (DealPhotos.hasPhoto(photo)) {
				$scope.hasPhoto = true;
				DealPhotos.getPhoto(photo, $scope.deal.id);
				$scope.dealImageStatus = "loading";
				$scope.$on('downloaded-photo-' + $scope.deal.id, function(event, args) {
	          		if (args.success) {
	          			$scope.deal.photo = args.data;
	          			$scope.dealImageStatus = "doneLoading";
	          			$scope.$apply();
	          		} else {
						console.log(args.message);
	          		}
	        	});
			} else {
				$scope.imageBackgroundColor = DealPhotos.colorForNum($scope.deal.photo1);
			}
		}
		
		function setDealerProfile () {
			/*
			 * Arranges the dealer's profile section.
			 */
			var photo = $scope.deal.dealer.photo;
			var sender = 'view-deal';
			$scope.hasProfilePic = DealerPhotos.hasProfilePic(photo);
			if ($scope.hasProfilePic) {
				$scope.profilePic = "";
        		DealerPhotos.getPhoto(photo, $scope.deal.dealer.id, sender);
        		$scope.profilePicStatus = "loading";
        	}
        	$scope.$on('downloaded-' + sender + '-profile-pic-' + $scope.deal.dealer.id, function(event, args) {
          		if (args.success) {
          			$scope.profilePic = args.data;
          			$scope.profilePicStatus = "doneLoading";
          		} else {
					console.log(args.message);
					$scope.profilePicStatus = "failed";
          		}
        	});
		}
		
		function mapDealData() {
			/*
			 * Map the deal's data that should be converted from the server keys to regular strings.
			 */
			$scope.deal = Deal.mapData($scope.deal);
		}
		
		
		
		function waitForProfilePic() {
			$scope.$on('downloaded-' + $rootScope.userProfilePicSender + '-profile-pic-' + $scope.deal.dealer.id, function(event, args) {
	      		if (args.success) {
	      			$scope.userProfilePic = args.data;
	      		} else {
	      			$scope.userProfilePic = null;
					console.log(args.message);
	      		}
	    	});
		}
		
		function addComment(form) {
			if (!form.$valid) {
				$scope.presentCommentError();
				return;
			} else {
				var comment = $scope.comment;
				comment.upload_date = new Date();
				comment.deal = $scope.deal.id;
				comment.dealer = $rootScope.dealer.id;
				comment.type = "Deal";
				$scope.showCommentError = false;
				$http.post($rootScope.baseUrl + '/addcomments/', comment)
				.then(function (response) {
		            // success
		            console.log("Comment uploaded successfully!");
		            comment = response.data;
		            comment.dealer = $rootScope.dealer;
		            $scope.deal.comments.push(comment);
		            $scope.comment = {};
		        },
		        function (httpError) {
		          	// error
		          	console.log(httpError.status + " : " + httpError.data);
		          	$scope.showCommmentError = true;
		          	$scope.presentErrorMessage("There was an error, please try again");
		        });
			}
		}
		
		function presentCommentError(errorMessage) {
			/*
			 * Present an error message above the comment textarea.
			 */
			if (errorMessage) {
				$scope.commentErrorMessage = errorMessage;
			}
			$scope.showCommentError = true;
		}
	}]);
})();