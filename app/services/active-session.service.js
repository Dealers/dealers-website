(function () {
    'use strict';

    angular.module('DealersApp')
        /**
         * Manages information regarding current sessions of the user.
         */
        .factory('ActiveSession', ActiveSessionFactory);

    ActiveSessionFactory.$inject = ['$http', '$rootScope', '$cookies'];
    function ActiveSessionFactory($http, $rootScope, $cookies) {

        var service = {};

        service.actionsToRun = []; // Saves string representations of functions that should run in when needed.
        var tempData = {}; // Contains arbitrary data that is stored in order to be passed between controllers.

        service.getTempData = getTempData;
        service.setTempData = setTempData;
        service.removeTempData = removeTempData;
        service.addActionToRun = addActionToRun;
        service.shouldRunAction = shouldRunAction;

        return service;

        /**
         * Adds the received string representation of an action to the Actions To Run array.
         * @param action - the string representation of the action.
         */
        function addActionToRun(action) {
            service.actionsToRun.push(action);
        }

        /**
         * Returns true if the action should run, otherwise return false.
         * @param action - the string representation of the action.
         * @return {boolean} - true if should run the action, else false.
         */
        function shouldRunAction(action) {
            if ($.inArray(action, service.actionsToRun) != -1) {
                // Should run the action
                var index = service.actionsToRun.indexOf(action);
                service.actionsToRun.splice(index, 1);
                return true;
            }
            return false;
        }

        /**
         * @param key - the key.
         * @returns {{}} the object in the received key.
         */
        function getTempData(key) {
            return tempData[key];
        }

        /**
         * Sets the data in the key.
         * @param key - the key.
         * @param data - the data to save.
         */
        function setTempData(key, data) {
            tempData[key] = data;
        }

        /**
         * Removes the received key from the tempData object.
         * @param key - the key to remove.
         */
        function removeTempData(key) {
            if (tempData.hasOwnProperty(key)) {
                delete tempData.key;
            }
        }
    }
})();