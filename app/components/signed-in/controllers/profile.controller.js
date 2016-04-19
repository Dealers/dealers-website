(function () {
    'use strict';

	angular.module('DealersApp')
	.controller('ProfileController', ['$scope', '$rootScope', '$routeParams', '$location', 'Product', 'Dealer', 'DealerPhotos',
		function ($scope, $rootScope, $routeParams, $location, Product, Dealer, DealerPhotos) {
		/*
		 * The controller that manages the dealers' Profile view.
		 */
		var ctrl = this;
		var dealerID = $routeParams.dealerID;
		var dealerUrl = $rootScope.baseUrl;
		var ProductsUrl = $rootScope.baseUrl;
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
		$scope.uploadedProducts = [];
		$scope.mode;
		$scope.message;
		$scope.status = loadingStatus;
		$scope.downloadDealerStatus = loadingStatus;
		$scope.settings = ["Log Out"];
		$scope.settingsDisplay = false;
		$scope.settingsToggle = settingsToggle;
		$scope.logOut = logOut;
		
		$scope.update = {};
		$scope.update.loadingMore = false;
		$scope.update.nextPage;
		$scope.getDealer = getDealer;
		$scope.setDealerProfile = setDealerProfile;
		$scope.getUploadedProducts = getUploadedProducts;
		
		if (parseInt(dealerID) == $rootScope.dealer.id) {
			// The dealer is the user, can get his details from the root scope.
			$scope.mode = myProfileMode;
			$scope.profile.dealer = $rootScope.dealer;
		} else {
			// The dealer is not the user.
			$scope.mode = otherProfileMode;
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
			 * Sets the profile header section and downloads the relevant products that are related to the dealer.
			 */
			setProfilePic();
			setRank($scope.profile.dealer.rank);
			$scope.getUploadedProducts();
		}
		
		function getUploadedProducts(nextPage) {
			/**
			 * Downloads the products that the dealer uploaded.
			 */
			// Checking if asking for another page
			if (nextPage) {
				ProductsUrl = nextPage;
			}
			
			ProductsUrl += '/uploadeddeals/' + $scope.profile.dealer.id + '/';
			
			Product.getProducts(ProductsUrl)
			.then(function (result) {
				$scope.status = downloadedStatus;
				var products = result.data.uploaded_deals;
				mapProductData(products);
				if (products.length > 0) {
					$scope.uploadedProducts.push.apply($scope.uploadedProducts, products);
					$scope.update.nextPage = result.data.next;
				} else {
					$scope.message = noDealsMessage;
				}
				$scope.update.loadingMore = false;
			}, function (httpError) {
				$scope.status = failedStatus;
				$scope.message = "Couldn't download the products";
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
		
		function mapProductData(data) {
			/*
			 * Map the data that should be converted from server keys to regular strings.
			 */
			for (var i = 0; i < data.length; i++) {
			    var product = data[i];
			    product = Product.mapData(product);
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
		
		function settingsToggle() {
			/**
			 * Toggles the display of the settings dropdown.
			 */
			if ($scope.settingsDisplay) {
				$scope.settingsDisplay = false;
			} else {
				$scope.settingsDisplay = true;
			}
		}
		
		function logOut() {
					Dealer.logOut();
					$location.path('/');
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