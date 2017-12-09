/**
 * Created by gullumbroso on 12/11/2016.
 */

angular.module('DealersApp')
/**
 * The controller that is responsible for dialogs's behaviour.
 * @param $scope - the isolated scope of the controller.
 * @param $mdDialog - the mdDialog service of the Material Angular library.
 */
    .controller('RegisterPricePlansController', ['$scope', '$rootScope', '$http', '$location', '$mdDialog', '$mdMedia', '$timeout', 'Dealer', 'DealerPhotos', 'Photos', 'Dialogs', 'Translations',
        function ($scope, $rootScope, $http, $location, $mdDialog, $mdMedia, $timeout, Dealer, DealerPhotos, Photos, Dialogs, Translations) {

            var STARTER = "Starter";
            var NO_MARKETING = "No Marketing";
            var STANDARD = "Standard";
            var PROFESSIONAL = "Professional";
            var PREMIUM = "Premium";
            var SKIP = "skip";
            var DEALERS_BASE_URL = $rootScope.baseUrl + '/dealers/';
            var RPP_SESSION = "register-price-plans-session";
            var REGISTER_PRICE_PLANS_BROADCASTING_PREFIX = 'register-bank-account-for-';

            var dealer = {marketing_plan: NO_MARKETING};
            var dealerID = $rootScope.dealer.id;

            $scope.dealer = $rootScope.dealer;
            $scope.loading = null;
            $scope.startLoading = null;

            $scope.selectPlan = function (event, planID) {
                switch (planID) {
                    case 0:
                        dealer.marketing_plan = NO_MARKETING;
                        break;
                    case 1:
                        dealer.marketing_plan = STANDARD;
                        break;
                    case 2:
                        dealer.marketing_plan = PROFESSIONAL;
                        break;
                    case 3:
                        dealer.marketing_plan = PREMIUM;
                        break;
                    case 4:
                        dealer.marketing_plan = SKIP;
                        break;
                    default:
                        dealer.marketing_plan = NO_MARKETING;
                        break;
                }

                $http.patch(DEALERS_BASE_URL + dealerID + '/', dealer)
                    .then(function (response) {
                            // success
                            var dealer = response.data;
                            Intercom('trackEvent', 'selected_marketing_plan', {
                                plan: dealer.marketing_plan
                            });
                            window.Intercom("update", {
                                app_id: $rootScope.INTERCOM_APP_ID,
                                user_id: $rootScope.dealer.id,
                                user_hash: $rootScope.dealer.intercom_code,
                                plan: dealer.marketing_plan
                            });
                            $scope.loading = null;
                            enter();
                        },
                        function (httpError) {
                            // error
                            Dialogs.showAlertDialog(Translations.dealerRegistration.generalProblemTitle, Translations.dealerRegistration.generalProblemContent, event);
                            stopLoading(planID);
                        });

                startLoading(planID);
            };

            function startLoading(planID) {
                $scope.startLoading = planID;
                $timeout(function () {
                    $scope.loading = planID;
                    $rootScope.$apply();
                }, 500);
            }

            function stopLoading(planID) {
                $scope.loading = null;
                $timeout(function () {
                    $scope.startLoading = null;
                    $rootScope.$apply();
                }, 500);
            }

            $scope.skip = function (event) {
                $scope.selectPlan(event, 4)
            };

            /**
             * Final operations before enetring the system.
             */
            function enter() {
                if (Dealer.isExistingDealer()) {
                    $location.path("/home");
                } else {
                    $location.path("/done-registration");
                }
            }
        }]);
