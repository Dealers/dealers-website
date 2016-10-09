angular.module('DealersApp')
    .factory('Comment', ['$http', '$rootScope', 'Authentication', function CommentFactory($http, $rootScope, Authentication) {

        var ctrl = this;
        var service = {};

        service.postComment = postComment;
        service.getProducts = getProducts;
        service.mapData = mapData;

        return service;

        function postComment(comment) {
            /*
             * Posts a comment to the server
             */
            if (comment) {

                return $http.get($rootScope.baseUrl + '/alldeals/' + String(dealID) + '/');
            }
        }

        function getDeals(from) {
            /*
             * Returns a call for a list of products form the server
             */
            return $http.get($rootScope.baseUrl + from);
        }
    }]);