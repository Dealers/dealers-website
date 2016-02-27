/*
 *  Manages information regarding the current session of the user.
 */
(function () {
    'use strict';

	angular.module('DealersApp')
	.factory('ActiveSession', ActiveSessionFactory);
	
	ActiveSessionFactory.$inject = ['$http', '$rootScope', '$cookies'];
	function ActiveSessionFactory($http, $rootScope, $cookies) {
		
		var service = {};
		var tempData = {}; // Contains arbitrary data that is stored in order to be passed between controllers.
		service.setTempData = setTempData;
		service.getTempData = getTempData;
		return service;
		
		function setTempData(data) {
			if (data) {
				tempData = data;
			}
		}
		
		function getTempData() {
			return tempData;
		}
	}
})();