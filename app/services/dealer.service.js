/*
 *  Contains methods for downloading users' info, authenticating users and registering new users.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
        .factory('Dealer', DealerFactory);

    DealerFactory.$inject = ['$http', '$rootScope', 'Authentication'];
    function DealerFactory($http, $rootScope, Authentication) {

        var DEFAULT_UN = "g@g.com";
        var DEFAULT_PW = "09";
        var BROADCASTING_PREFIX = 'register-as-dealer-for-';

        this.saveCurrent = saveCurrent;
        this.setCredentials = setCredentials;
        this.broadcastResult = broadcastResult;

        var ctrl = this;
        var service = {};

        service.create = create;
        service.logIn = logIn;
        service.logOut = logOut;
        service.getDealer = getDealer;
        service.registerDealer = registerDealer;

        return service;

        /**
         * Creates a new dealer object in the server when a new user signs up (as a viewer).
         * @param dealer - the new user (named dealer because of legacy naming).
         */
        function create(dealer) {
            var password = dealer.user.password;
            var credentials = Authentication.getCredentials(DEFAULT_UN, DEFAULT_PW);
            $http.post($rootScope.baseUrl + '/dealers/', dealer, {headers: {'Authorization': credentials}})
                .then(function (response) {
                        // success
                        var dealer = response.data;
                        ctrl.saveCurrent(dealer);
                        ctrl.setCredentials(dealer.user.username, password);
                        ctrl.broadcastResult('sign-up', true, dealer);
                    },
                    function (httpError) {
                        // error
                        ctrl.broadcastResult('sign-up', false, httpError);
                    });
        }

        /**
         * Validates the username and password that were received and if valid logs the user in.
         * @param username - the username that was entered.
         * @param password - the password that was entered.
         */
        function logIn(username, password) {
            var credentials = Authentication.getCredentials(username, password);
            $http.get($rootScope.baseUrl + '/dealerlogins/', {
                    headers: {'Authorization': credentials}
                })
                .then(function (response) {
                        // success
                        var dealer = response.data.results[0];
                        ctrl.saveCurrent(dealer);
                        ctrl.setCredentials(username, password);
                        ctrl.broadcastResult('log-in', true, dealer);
                    },
                    function (httpError) {
                        // error
                        ctrl.broadcastResult('log-in', false, httpError);
                    });
        }

        /**
         * Logs the user out.
         */
        function logOut() {
            Authentication.clearCredentials();
            localStorage.clear();
            $rootScope.dealer = null;
        }

        /**
         * Saves the user's information in the local storage of the browser.
         * @param dealer - the dealer object containing the user's information.
         */
        function saveCurrent(dealer) {
            if (dealer) {
                localStorage.setItem('dealer', JSON.stringify(dealer));
                $rootScope.dealer = dealer;
            }
        }

        /**
         * Asks for a token and sets it in the default headers of angular's $http service.
         * @param username - the username.
         * @param password - the password.
         */
        function setCredentials(username, password) {
            Authentication.getToken(username, password)
                .then(function (response) {
                        // success
                        console.log("Set credentials successfully! Get in!");
                        Authentication.saveCredentials(username, response.data.token);
                        ctrl.broadcastResult('credentials-set', true);
                    },
                    function (httpError) {
                        console.log("Couldn't get token:" + httpError);
                        ctrl.broadcastResult('credentials-set', false);
                    });
        }

        /**
         * Broadcasts messages via the $broadcast service.
         * @param process - the process that is waiting for the broadcast.
         * @param success - a boolean that indicates if the result was successful or not.
         * @param message - a message containing data regarding the result.
         */
        function broadcastResult(process, success, message) {
            $rootScope.$broadcast(process, {success: success, message: message});
        }

        /**
         * Downloads the dealer's information according to the received dealer id.
         */
        function getDealer(dealerID) {
            return $http.get($rootScope.baseUrl + '/dealers/' + dealerID + '/');
        }

        /**
         * Register the received dealer.
         * @param bankAccount - the new dealer's bank account object.
         * @param sender - the controller that asked for the service.
         */
        function registerDealer(bankAccount, sender) {
            $http.post($rootScope.baseUrl + '/bank_accounts/', bankAccount)
                .then(function (response) {
                        // success
                        console.log("Added the bank account information successfully. Now upload the the dealer's information.");
                        $rootScope.dealer.role = $rootScope.roles.dealer;
                        var dealer = cleanDealerObject($rootScope.dealer);
                        $http.patch($rootScope.baseUrl + '/dealers/' + dealer.id + '/', dealer)
                            .then(function (response) {
                                    // success
                                    var dealer = response.data;
                                    ctrl.saveCurrent(dealer);
                                    broadcastResult(BROADCASTING_PREFIX + sender, true, dealer);
                                },
                                function (httpError) {
                                    // error
                                    broadcastResult(BROADCASTING_PREFIX + sender, false, httpError);
                                });
                    },
                    function (httpError) {
                        // error
                        broadcastResult(BROADCASTING_PREFIX + sender, false, httpError);
                    });
        }

        /**
         * Returns the dealer object of the user without unnecessary attributes for the patch request.
         * @param dealer - the dealer object that should be cleaned.
         */
        function cleanDealerObject(dealer) {
            var clean_dealer = $.extend({}, dealer);
            if (clean_dealer.hasOwnProperty("bank_accounts")) {
                delete clean_dealer["bank_accounts"];
            }
            if (clean_dealer.hasOwnProperty("screen_counters")) {
                delete clean_dealer["screen_counters"];
            }
            return clean_dealer;
        }
    }

})();