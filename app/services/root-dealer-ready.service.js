/**
 * Created by gullumbroso on 09/08/2016.
 */

(function () {
    'use strict';

    angular.module('DealersApp')
        .factory('RootDealerReady', RootDealerReadyFactory);

    RootDealerReadyFactory.$inject = ['$q'];
    function RootDealerReadyFactory($q) {

        var deferred = $q.defer();
        var service = {};

        service.setAsReady = function (dealer) {
            deferred.resolve(dealer);
        };

        service.whenReady = function () {
            return deferred.promise;
        };

        return service;
    }
});