angular.module('DealersApp')
    .controller('ProfileController', ['$scope', '$rootScope', '$routeParams', '$location', 'Product', 'Dealer', 'DealerPhotos',
        function ($scope, $rootScope, $routeParams, $location, Product, Dealer, DealerPhotos) {
            /*
             * The controller that manages the dealers' Profile view.
             */

            var dealerID = $routeParams.dealerID;
            var dealerUrl = $rootScope.baseUrl;
            var ProductsUrl = $rootScope.baseUrl;
            var noDealsMessage;

            var GUEST_MODE = "guestMode";
            var MY_PROFILE_MODE = "myProfile";
            var OTHER_PROFILE_MODE = "otherProfile";
            var DEALER_DOWNLOADED = "dealerDownloaded";
            var DEALER_FAILED = "failed";
            var LOADING_STATUS = "loading";
            var DOWNLOAD_STATUS = "downloaded";
            var FAILED_STATUS = "failed";
            var VIEWER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_viewer_icon.png";
            var DEALER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_dealer_icon.png";
            var PRO_DEALER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_pro_dealer_icon.png";
            var SENIOR_DEALER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_senior_dealer_icon.png";
            var MASTER_DEALER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_master_dealer_icon.png";

            $scope.profile = {dealer: null};
            $scope.uploadedProducts = [];
            $scope.profileMode = "";
            $scope.displayModes = {
                myProducts: "MY PRODUCTS",
                purchases: "SALES",
                orders: "ORDERS"
            };
            $scope.message = "";
            $scope.status = LOADING_STATUS;
            $scope.downloadDealerStatus = LOADING_STATUS;
            $scope.settings = ["Log Out"];
            $scope.settingsDisplay = false;

            // For the products-grid directive
            $scope.source = $rootScope.baseUrl + "/uploadeddeals/" + dealerID + "/";
            $scope.page = "profile";
            $scope.products = [];
            $scope.settingsToggle = settingsToggle;
            $scope.logOut = logOut;

            $scope.update = {};
            $scope.update.loadingMore = false;
            $scope.update.nextPage = "";
            $scope.getDealer = getDealer;
            $scope.setDealerProfile = setDealerProfile;
            $scope.getUploadedProducts = getUploadedProducts;
            $scope.changeDisplayPresentation = changeDisplayPresentation;
            $scope.changeDisplayToTab = changeDisplayToTab;

            if (location.href.endsWith("/sales")) {
                changeDisplay($scope.displayModes.purchases);
            } else if (location.href.endsWith("/orders")) {
                changeDisplay($scope.displayModes.orders);
            } else {
                changeDisplay($scope.displayModes.myProducts);
            }

            if (!$rootScope.dealer) {
                $scope.profileMode = GUEST_MODE;
            } else if (parseInt(dealerID) == $rootScope.dealer.id) {
                // The dealer is the user, can get his details from the root scope.
                $scope.profileMode = MY_PROFILE_MODE;
                $scope.profile.dealer = $rootScope.dealer;
                if ($scope.profile.dealer.role == $rootScope.roles.viewer) {
                    changeDisplay($scope.displayModes.orders);
                }
            } else {
                // The dealer is not the user.
                $scope.profileMode = OTHER_PROFILE_MODE;
                changeDisplay($scope.displayModes.myProducts);
            }
            dealerUrl += '/dealers/' + dealerID;

            $scope.getDealer(dealerID);

            function getDealer(dealerID) {
                /**
                 * Downloads the dealer's information if necessary.
                 */
                if ($scope.profile.dealer) {
                    // The dealer's information is already available.
                    $scope.downloadDealerStatus = DOWNLOAD_STATUS;
                    $scope.setDealerProfile();
                    return;
                }
                Dealer.getDealer(dealerID)
                    .then(function (result) {
                        $scope.profile.dealer = result.data;
                        $scope.downloadDealerStatus = DOWNLOAD_STATUS;
                        $scope.setDealerProfile();
                    }, function (httpError) {
                        $scope.message = "Couldn't download dealer's information";
                        $scope.errorPrompt = "Please try again...";
                    });
            }

            /**
             * Sets the profile header section and downloads the relevant products that are related to the dealer.
             */
            function setDealerProfile() {
                setProfilePic();
                setRank($scope.profile.dealer.rank);
                $scope.getUploadedProducts();
            }

            /**
             * Downloads the products that the dealer uploaded.
             */
            function getUploadedProducts(nextPage) {
                // Checking if asking for another page
                if (nextPage) {
                    ProductsUrl = nextPage;
                }

                ProductsUrl += '/uploadeddeals/' + $scope.profile.dealer.id + '/';

                Product.getProducts(ProductsUrl)
                    .then(function (result) {
                        $scope.status = DOWNLOAD_STATUS;
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
                        $scope.status = FAILED_STATUS;
                        $scope.message = "Couldn't download the products";
                        $scope.errorPrompt = "Please try again...";
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
                    $scope.profilePicStatus = LOADING_STATUS;
                }
                $scope.$on('downloaded-' + sender + '-dealer-pic-' + $scope.profile.dealer.id, function (event, args) {
                    if (args.success) {
                        $scope.$apply(function () {
                            $scope.profilePic = args.data;
                            $scope.profilePicStatus = DOWNLOAD_STATUS;
                        });
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

            /**
             * Opens an angular-material dropdown menu.
             * @param $mdOpenMenu - the menu to open.
             * @param ev - the event that triggered the function.
             */
            $scope.openMenu = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            $scope.editProfile = function (event) {
                $location.path("/edit-profile/" + dealerID);
            };

            function logOut() {
                Dealer.logOut();
                $location.path('/');
            }

            function changeDisplayPresentation(element) {
                var activeClass = "active";
                $(element).addClass(activeClass);
                $(element).siblings().removeClass(activeClass);
            }

            function changeDisplayToTab(selectedTab) {
                if (selectedTab == "myProducts") {
                    changeDisplay($scope.displayModes.myProducts);
                } else if (selectedTab == "sales") {
                    changeDisplay($scope.displayModes.purchases);
                } else if (selectedTab == "orders") {
                    changeDisplay($scope.displayModes.orders);
                }

            }

            function changeDisplay(displayMode) {
                $scope.displayMode = displayMode;
                var pathSuffix = "/dealers/" + dealerID;
                if (displayMode == $scope.displayModes.purchases) {
                    pathSuffix += "/" + $scope.displayModes.purchases.toLowerCase();
                } else if (displayMode == $scope.displayModes.orders) {
                    pathSuffix += "/" + $scope.displayModes.orders.toLowerCase();
                }
                if ($location.path() != pathSuffix) {
                    $location.path(pathSuffix);
                }
            }

            function setRank(rank) {
                var iconUrl;
                var iconClass;
                if (rank == "Viewer") {
                    iconUrl = VIEWER_ICON;
                    iconClass = "viewerIcon";
                } else if (rank == "Dealer") {
                    iconUrl = DEALER_ICON;
                    iconClass = "dealerIcon";
                } else if (rank == "Pro Dealer") {
                    iconUrl = PRO_DEALER_ICON;
                    iconClass = "proDealerIcon";
                } else if (rank == "Senior Dealer") {
                    iconUrl = SENIOR_DEALER_ICON;
                    iconClass = "seniorDealerIcon";
                } else if (rank == "Master Dealer") {
                    iconUrl = MASTER_DEALER_ICON;
                    iconClass = "masterDealerIcon";
                }
                $scope.rankIcon = iconUrl;
                $scope.rankClass = iconClass;
            }
        }]);