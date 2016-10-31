angular.module('DealersApp')
/**
 * The controller that manages the Product Grid view.
 */
    .controller('ProductsGridController', ['$scope', '$rootScope', '$routeParams', 'ActiveSession', 'Product', 'ProductsGrid', 'Translations',
        function ($scope, $rootScope, $routeParams, ActiveSession, Product, ProductsGrid, Translations) {

            var PROFILE_DEALER_AS_KEY = "profile_dealer_id";
            var PROFILE_AS_KEY = "profile_products";
            var PROFILE_PAGE = "dealer";
            var LOADING_STATUS = "loading";
            var DOWNLOADED_STATUS = "downloaded";
            var FAILED_STATUS = "failed";

            var mode;
            var url = $rootScope.baseUrl;
            var routeParams;
            var noProductsMessage;

            $scope.products = [];
            $scope.message = "";
            $scope.status = LOADING_STATUS;

            $scope.update = {};
            $scope.update.loadingMore = false;
            $scope.update.nextPage = "";
            $scope.getProducts = getProducts;

            selectAction();

            /**
             * Determines what to do according to the details defined in the scope.
             */
            function selectAction() {
                if ($scope.source) {
                    // There is a specific source to download products from.
                    if ($scope.page == PROFILE_PAGE) {
                        var dealerID = ActiveSession.getTempData(PROFILE_DEALER_AS_KEY);
                        var tempData = ActiveSession.getTempData(PROFILE_AS_KEY);
                        routeParams = $routeParams.dealerID;
                        if (dealerID == routeParams) {
                            if (tempData) {
                                mode = "activeSession";
                                noProductsMessage = "There are no products.";
                                $scope.status = DOWNLOADED_STATUS;
                                updateGrid(tempData);
                                return;
                            }
                        }
                    }
                    mode = "custom";
                    url = $scope.source;
                    noProductsMessage = Translations.productsGrid.noProducts;

                } else if ($routeParams.query) {
                    // This is a search session, should get the products according to the search term.
                    mode = "search";
                    routeParams = $routeParams.query;
                    url += '/dealsearch/?search=' + routeParams;
                    noProductsMessage = Translations.productsGrid.didntFind + "'" + routeParams + "'.";
                } else if ($routeParams.category) {
                    // This is a search session, should get the products according to the search term.
                    mode = "category";
                    routeParams = $routeParams.category;
                    if (routeParams == "All Categories" || routeParams == "All%20Categories") {
                        mode = "myFeed";
                        url += '/my_feeds/';
                    } else {
                        url += '/category_deals/?category=' + Product.keyForCategory(routeParams);
                    }
                    noProductsMessage = Translations.productsGrid.currentlyNoProducts + routeParams + "...";
                    $scope.title = Translations.translateCategory(routeParams);
                } else {
                    // This is a My Feed session, should get the products from the my-feed endpoint.
                    mode = "myFeed";
                    url += '/my_feeds/';
                    noProductsMessage = Translations.productsGrid.noProductsInterests;
                }

                $scope.getProducts();
            }

            /**
             * Downloads products from the server.
             * @param nextPage - indicates if downloading the next page from the same source.
             */
            function getProducts(nextPage) {

                // Checking if asking for another page
                if (nextPage) {
                    url = nextPage;
                }

                Product.getProducts(url)
                    .then(function (result) {
                        $scope.status = DOWNLOADED_STATUS;
                        var products;
                        if (result.data.results) {
                            products = result.data.results;
                        } else if (result.data.uploaded_deals) {
                            products = result.data.uploaded_deals;
                        }
                        $scope.update.nextPage = result.data.next;
                        updateGrid(products);
                        $scope.update.loadingMore = false;

                        if ($scope.page == PROFILE_PAGE) {
                            ActiveSession.setTempData(PROFILE_DEALER_AS_KEY, routeParams);
                            ActiveSession.setTempData(PROFILE_AS_KEY, products);
                        }

                    }, function (httpError) {
                        $scope.status = FAILED_STATUS;
                        $scope.message = "Couldn't download the products";
                        $scope.errorPrompt = "Please try again...";
                        $scope.update.loadingMore = false;
                    });
            }

            /**
             * Updates the products that are presented in the grid with the received array.
             * @param products - the products to present in the grid.
             */
            function updateGrid(products) {
                mapProductData(products);
                if (products.length > 0) {
                    $scope.products = ProductsGrid.addProductsToArray($scope.products, products);
                } else {
                    $scope.message = noProductsMessage;
                }
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
        }]);