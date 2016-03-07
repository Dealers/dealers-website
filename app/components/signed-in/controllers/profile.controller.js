(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('ProfileController', ['$scope', '$rootScope', '$routeParams', 'Deal', 'Dealer', 'DealerPhotos',
		function ($scope, $rootScope, $routeParams, Deal, Dealer, DealerPhotos) {
		/*
		 * The controller that manages the dealers' Profile view.
		 */
		var ctrl = this;
		var mode;
		var dealerID = $routeParams.dealerID;
		var dealerUrl = $rootScope.baseUrl;
		var dealsUrl = $rootScope.baseUrl;
		var routeParams;
		var noDealsMessage;
		
		const myProfileMode = "myProfile";
		const otherProfileMode = "otherProfile";
		const dealerDonwloaded = "dealerDownloaded";
		const dealerFailed = "failed";
		const loadingStatus = "loading";
		const downloadedStatus = "downloaded";
		const failedStatus = "failed";
		const viewerIcon = "../../../../assets/images/icons/@2x/Web_Icons_viewer_icon.png";
		const dealerIcon = "../../../../assets/images/icons/@2x/Web_Icons_dealer_icon.png";
		const proDealerIcon = "../../../../assets/images/icons/@2x/Web_Icons_pro_dealer_icon.png";
		const seniorDealerIcon = "../../../../assets/images/icons/@2x/Web_Icons_senior_dealer_icon.png";
		const masterDealerIcon = "../../../../assets/images/icons/@2x/Web_Icons_master_dealer_icon.png";
		
		$scope.profile = {dealer: null};
		$scope.uploadedDeals = [];
		$scope.message;
		$scope.status = loadingStatus;
		$scope.downloadDealerStatus = loadingStatus;
		
		$scope.update = {};
		$scope.update.loadingMore = false;
		$scope.update.nextPage;
		$scope.getDealer = getDealer;
		$scope.setDealerProfile = setDealerProfile;
		$scope.getUploadedDeals = getUploadedDeals;
		
		if (parseInt(dealerID) == $rootScope.dealer.id) {
			// The dealer is the user, can get his details from the root scope.
			mode = myProfileMode;
			$scope.profile.dealer = $rootScope.dealer;
		} else {
			// The dealer is not the user.
			mode = otherProfileMode;
		}
		dealerUrl += '/dealers/' + dealerID;
		
		$scope.getDealer(dealerID);
		
		function getDealer(dealerID) {
			/**
			 * Downloads the dealer's information if necessary.
			 */
			if ($scope.profile.dealer) {
				// The dealer's information is already available.
				$scope.downloadDealerStatus = downloadedStatus;
				$scope.setDealerProfile();
				return;
			}
			Dealer.getDealer(dealerID)
			.then(function (result) {
				$scope.profile.dealer = result.data;
				$scope.downloadDealerStatus = downloadedStatus;
				$scope.setDealerProfile();
			}, function (httpError) {
				$scope.message = "Couldn't download dealer's information";
				$scope.errorPrompt =  "Please try again...";
			});
		}
		
		function setDealerProfile() {
			/**
			 * Sets the profile header section and downloads the relevant deals that are related to the dealer.
			 */
			setProfilePic();
			setRank($scope.profile.dealer.rank);
			$scope.getUploadedDeals();
		}
		
		function getUploadedDeals(nextPage) {
			/**
			 * Downloads the deals that the dealer uploaded.
			 */
			// Checking if asking for another page
			if (nextPage) {
				dealsUrl = nextPage;
			}
			
			dealsUrl += '/uploadeddeals/' + $scope.profile.dealer.id + '/';
			
			Deal.getDeals(dealsUrl)
			.then(function (result) {
				$scope.status = downloadedStatus;
				var deals = result.data.uploaded_deals;
				mapDealData(deals);
				if (deals.length > 0) {
					$scope.uploadedDeals.push.apply($scope.uploadedDeals, deals);
					$scope.update.nextPage = result.data.next;
				} else {
					$scope.message = noDealsMessage;
				}
				$scope.update.loadingMore = false;
			}, function (httpError) {
				$scope.status = failedStatus;
				$scope.message = "Couldn't download the deals";
				$scope.errorPrompt =  "Please try again...";
				$scope.update.loadingMore = false;
			});
		}
		
		function getPageParams(nextPage) {
			var paramsIndex = nextPage.indexOf("page") + 1; // +1 to get rid of the redundant backslash before the questionmark
			var paramsString;
			if (paramsIndex != -1) {
				paramsString = nextPage.substring(paramsIndex);
			}
			return paramsString;
		}	
		
		function mapDealData(data) {
			/*
			 * Map the data that should be converted from server keys to regular strings.
			 */
			for (var i = 0; i < data.length; i++) {
			    var deal = data[i];
			    deal = Deal.mapData(deal);
			}
		}
		
		function setProfilePic() {
			/**
			 * Sets the profile picture of the dealer.
			 */
			$scope.hasProfilePic = DealerPhotos.hasProfilePic($scope.profile.dealer.photo);
        	var sender = 'profile';
        	if ($scope.hasProfilePic) {
        		$scope.profilePic = "";
        		DealerPhotos.getPhoto($scope.profile.dealer.photo, $scope.profile.dealer.id, sender);
        		$scope.profilePicStatus = loadingStatus;
        	}
        	$scope.$on('downloaded-' + sender + '-profile-pic-' + $scope.profile.dealer.id, function(event, args) {
          		if (args.success) {
          			$scope.profilePic = args.data;
          			$scope.profilePicStatus = downloadedStatus;
          		} else {
					console.log(args.message);
          		}
        	});
		}
		
		function setRank(rank) {
			var iconUrl;
			var iconClass;
			if (rank == "Viewer") {
				iconUrl =  viewerIcon;
				iconClass = "viewerIcon";
			} else if (rank == "Dealer") {
				iconUrl =  dealerIcon;
				iconClass = "dealerIcon";
			} else if (rank == "Pro Dealer") {
				iconUrl =  proDealerIcon;
				iconClass = "proDealerIcon";
			} else if (rank == "Senior Dealer") {
				iconUrl =  seniorDealerIcon;
				iconClass = "seniorDealerIcon";
			} else if (rank == "Master Dealer") {
				iconUrl =  masterDealerIcon;
				iconClass = "masterDealerIcon";
			}
			$scope.rankIcon = iconUrl;
			$scope.rankClass = iconClass;
		}
	}]);
})();