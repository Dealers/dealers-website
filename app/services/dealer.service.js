/*
 *  Contains methods for downloading users' info, authenticating users and registering new users.
 */

angular.module('DealersApp')
    .factory('Dealer', ['$http', '$rootScope', 'Authentication', 'FacebookPixel', function DealerFactory($http, $rootScope, Authentication, FacebookPixel) {

        var DEFAULT_UN = "ubuntu";
        var DEFAULT_PW = "090909deal";
        var REGISTER_BASIC_INFO_BROADCASTING_PREFIX = 'register-basic-info-for-';
        var REGISTER_BANK_ACCOUNT_BROADCASTING_PREFIX = 'register-bank-account-for-';
        var UPDATE_BROADCASTING_PREFIX = 'update-as-dealer-for-';
        var DEALERS_BASE_URL = $rootScope.baseUrl + '/dealers/';
        var SUBSCRIBERS_BASE_URL = $rootScope.baseUrl + '/subscribers/';

        this.saveCurrent = saveCurrent;
        this.setCredentials = setCredentials;
        this.broadcastResult = broadcastResult;

        var ctrl = this;
        var service = {};
        service.existingDealer = false;

        service.subscribe = subscribe;
        service.create = create;
        service.registerBasicInfo = registerBasicInfo;
        service.registerBankAccount = registerBankAccount;
        service.isExistingDealer = isExistingDealer;
        service.logIn = logIn;
        service.logOut = logOut;
        service.getDealer = getDealer;
        service.getShortDealer = getShortDealer;
        service.updateDealer = updateDealer;
        service.updateViewer = updateViewer;
        service.setIntercom = setIntercom;
        service.updateCurrentUser = updateCurrentUser;
        service.getServerLang = getServerLang;
        service.updateShippingAddress = updateShippingAddress;

        return service;

        function subscribe(email) {
            var subscriber = {
                email: email,
                language: getServerLang($rootScope.language),
                register_date: new Date()
            };
            var credentials = Authentication.getCredentials(DEFAULT_UN, DEFAULT_PW);
            $http.post(SUBSCRIBERS_BASE_URL, subscriber, {headers: {'Authorization': credentials}})
                .then(function (response) {
                        // success
                        subscriber = response.data;
                        ctrl.broadcastResult('subscribed', true, subscriber);
                    },
                    function (httpError) {
                        // error
                        ctrl.broadcastResult('subscribed', false, httpError);
                    });
        }

        /**
         * Creates a new dealer object in the server when a new user signs up (as a viewer).
         * @param dealer - the new user (named dealer because of legacy naming).
         */
        function create(dealer) {
            var password = dealer.user.password;
            var credentials = Authentication.getCredentials(DEFAULT_UN, DEFAULT_PW);
            $http.post(DEALERS_BASE_URL, dealer, {headers: {'Authorization': credentials}})
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
         * Saves the basic details of the user as a part of the register-as-dealer process.
         * @param sender - the controller that asked for the service.
         */
        function registerBasicInfo(sender) {
            $rootScope.dealer.role = $rootScope.roles.dealer;
            var dealer = cleanDealerObject($rootScope.dealer);
            $http.patch(DEALERS_BASE_URL + dealer.id + '/', dealer, {params: {mode: "new"}})
                .then(function (response) {
                        // success
                        var dealer = response.data;
                        ctrl.saveCurrent(dealer);
                        Intercom('trackEvent', 'registered_as_dealer', {});
                        FacebookPixel.completeRegistration();
                        broadcastResult(REGISTER_BASIC_INFO_BROADCASTING_PREFIX + sender, true, dealer);
                    },
                    function (httpError) {
                        // error
                        broadcastResult(REGISTER_BASIC_INFO_BROADCASTING_PREFIX + sender, false, httpError);
                    });
        }

        /**
         * Saves the bank account information of the user as a part of the register-as-dealer process.
         * @param bankAccount - the new dealer's bank account object.
         * @param sender - the controller that asked for the service.
         */
        function registerBankAccount(bankAccount, sender) {
            $http.post($rootScope.baseUrl + '/bank_accounts/', bankAccount)
                .then(function (response) {
                        // success
                        var bankAccount = response.data;
                        Intercom('trackEvent', 'inserted_bank_account', {});
                        FacebookPixel.addBankAccount();
                        broadcastResult(REGISTER_BANK_ACCOUNT_BROADCASTING_PREFIX + sender, true, bankAccount);
                    },
                    function (httpError) {
                        // error
                        broadcastResult(REGISTER_BANK_ACCOUNT_BROADCASTING_PREFIX + sender, false, httpError);
                    });
        }

        /**
         * @returns {boolean} True if the user reached the bank account form for the first time. The purpose of this helper function
         * is to avoid the situation of the user being passed to the "congratulations" screen after being there before already.
         */
        function isExistingDealer() {
            return service.existingDealer;
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
            logOutIntercom();
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
         * Downloads the current dealer object from the server to update the current object in the client.
         * @param dealerID - the id of the dealer that should be updated.
         */
        function updateCurrentUser(dealerID) {
            if (dealerID) {
                getDealer(dealerID)
                    .then(function (response) {
                            // success
                            var dealer = response.data;
                            saveCurrent(dealer);
                        },
                        function (httpError) {
                            console.log("Couldn't update the user:" + httpError);
                        });
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
            return $http.get(DEALERS_BASE_URL + dealerID + '/');
        }

        /**
         * Downloads the dealer's information in short format (name, photo and user object).
         * @param dealerID - the id of the dealer to download.
         * @returns {*} the $http get response object.
         */
        function getShortDealer(dealerID) {
            return $http.get($rootScope.baseUrl + "/dealershorts/" + dealerID + "/")
        }

        /**
         * Updates the received dealer's information (via Edit Profile).
         * @param bankAccount - the dealer's bank account object.
         * @param dealer - the updated dealer object.
         * @param sender - the controller that asked for the service.
         */
        function updateDealer(bankAccount, dealer, sender) {
            if (bankAccount && !$.isEmptyObject(bankAccount)) {
                $http.patch($rootScope.baseUrl + '/bank_accounts/' + bankAccount.id + '/', bankAccount)
                    .then(function (response) {
                            // success
                            console.log("Updated the bank account information successfully. Now update the the dealer's information.");
                            dealer = cleanDealerObject(dealer);
                            $http.patch(DEALERS_BASE_URL + dealer.id + '/', dealer, {params: {mode: "edit"}})
                                .then(function (response) {
                                        // success
                                        dealer = response.data;
                                        ctrl.saveCurrent(dealer);
                                        setIntercom(dealer);
                                        broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, true, dealer);
                                    },
                                    function (httpError) {
                                        // error
                                        broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, false, httpError);
                                    });
                        },
                        function (httpError) {
                            // error
                            broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, false, httpError);
                        });
            } else {
                dealer = cleanDealerObject(dealer);
                $http.patch(DEALERS_BASE_URL + dealer.id + '/', dealer, {params: {mode: "edit"}})
                    .then(function (response) {
                            // success
                            dealer = response.data;
                            ctrl.saveCurrent(dealer);
                            setIntercom(dealer);
                            broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, true, dealer);
                        },
                        function (httpError) {
                            // error
                            broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, false, httpError);
                        });
            }
        }

        /**
         * Updates the received viewer's information (via Edit Profile).
         * @param viewer - the updated profile object of the viewer.
         * @param sender - the controller that asked for the service.
         */
        function updateViewer(viewer, sender) {
            viewer = cleanDealerObject(viewer);
            $http.patch(DEALERS_BASE_URL + viewer.id + '/', viewer, {params: {mode: "edit"}})
                .then(function (response) {
                        // success
                        viewer = response.data;
                        ctrl.saveCurrent(viewer);
                        setIntercom(viewer);
                        broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, true, viewer);
                    },
                    function (httpError) {
                        // error
                        broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, false, httpError);
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
            if (clean_dealer.hasOwnProperty("uploaded_deals")) {
                delete clean_dealer["uploaded_deals"];
            }
            if (clean_dealer.hasOwnProperty("liked_deals")) {
                delete clean_dealer["liked_deals"];
            }
            return clean_dealer;
        }

        /**
         * Sets the user's information in Intercom.
         * @param user - the user.
         */
        function setIntercom(user) {
            window.Intercom("update", {
                app_id: $rootScope.INTERCOM_APP_ID,
                user_id: user.id,
                user_hash: user.intercom_code,
                name: user.full_name, // Full name
                email: user.email,
                date_of_birth: user.date_of_birth,
                gender: user.gender,
                location: user.location,
                role: user.role,
                rank: user.rank,
            });
        }

        /**
         * Sets the logout notice to Intercom.
         */
        function logOutIntercom() {
            window.Intercom("shutdown");
        }

        /**
         * Gets the server's representation of the received language.
         * @param lang - the received language.
         * @returns {String} the language representation.
         */
        function getServerLang(lang) {
            if (lang == "he") {
                return "Hebrew";
            } else if (lang == "en") {
                return "English";
            }
            return lang;
        }

        /**
         * Updates the shipping_address field of the current user.
         * @param shippingAddress - the new shipping address.
         * @returns {promise} - the promise object of the dealer.
         */
        function updateShippingAddress(shippingAddress) {
            var data = {
                shipping_address: shippingAddress
            };
            return $http.patch(DEALERS_BASE_URL + $rootScope.dealer.id, data);
        }
    }]);