(function () {
    'use strict';

    angular.module('DealersApp')
        .factory('Deal', DealFactory);

    DealFactory.$inject = ['$http', '$rootScope', 'Authentication'];
    function DealFactory($http, $rootScope, Authentication) {

        var ctrl = this;
        var service = {};

        const currencies = {
            'DO': '$',
            'SH': '₪',
            'YE': '¥',
            'YU': '¥',
            'PO': '£',
            'EU': '€'
        };
        const categories = {
            "Fa": "Fashion",
            "Au": "Automotive",
            "Ar": "Art",
            "Be": "Beauty & Personal Care",
            "Bo": "Books & Magazines",
            "El": "Electronics",
            "En": "Entertainment & Events",
            "Fo": "Food & Groceries",
            "Ho": "Home & Furniture",
            "Ki": "Kids & Babies",
            "Mu": "Music",
            "Pe": "Pets",
            "Re": "Restaurants & Bars",
            "Sp": "Sports & Outdoor",
            "Tr": "Travel",
            "Ot": "Other"
        };

        service.getDeal = getDeal;
        service.getDeals = getDeals;
        service.removePhotoPaths = removePhotoPaths;
        service.mapData = mapData;
        service.keyForCategory = keyForCategory;
        service.categoryForKey = categoryForKey;
        service.currencyForKey = currencyForKey;
        service.keyForCurrency = keyForCurrency;
        service.keyForDiscountType = keyForDiscountType;


        return service;

        /**
         * Returns a call for a specific deal form the server
         */
        function getDeal(dealID) {
            if (dealID) {
                return $http.get($rootScope.baseUrl + '/alldeals/' + String(dealID) + '/');
            }
        }

        /**
         * Returns a call for a list of deals form the server
         */
        function getDeals(url) {
            return $http.get(url);
        }

        /**
         * Returns the received product without the photo's paths properties.
         * @param product - the received product.
         * @returns {product} the "photo pathless" product.
         */
        function removePhotoPaths(product) {
            if (product.hasOwnProperty("photo1")) {
                delete product["photo1"];
            } else if (product.hasOwnProperty("photo2")) {
                delete product["photo2"];
            } else if (product.hasOwnProperty("photo3")) {
                delete product["photo3"];
            } else if (product.hasOwnProperty("photo4")) {
                delete product["photo4"];
            }
            return product;
        }

        /**
         * Converts the keys of the server to regular strings, and returns the updated deal.
         */
        function mapData(deal) {
            if (deal.category) {
                var category = categoryForKey(deal.category);
                if (category) {
                    deal.category = category;
                }
                return deal;
            }
        }

        /**
         * Returns the category that matches the received server key.
         * @param key - the server key.
         * @returns {string} the matching category.
         */
        function categoryForKey(key) {
            return categories[key];
        }

        /**
         * Returns the server key that matches the received category.
         * @param category - the received category.
         * @returns {string} the matching server key.
         */
        function keyForCategory(category) {
            for (var property in categories) {
                if (categories.hasOwnProperty(property)) {
                    if (categories[property] === category)
                        return property;
                }
            }
        }

        /**
         * Returns the currency that matches the received server key.
         * @param key - the server key.
         * @returns {string} the matching currency.
         */
        function currencyForKey(key) {
            return currencies[key];
        }

        /**
         * Returns the server key that matches the received currency.
         * @param currency - the currency.
         * @returns {string} the matching server key.
         */
        function keyForCurrency(currency) {
            for (var property in currencies) {
                if (currencies.hasOwnProperty(property)) {
                    if (currencies[property] === currency)
                        return property;
                }
            }
        }

        /**
         * Returns the server key that matches the received discount type.
         * @param type - the discount type.
         * @returns {string} the matching server key.
         */
        function keyForDiscountType(type) {
            if (type == "123") {
                return "PP";
            } else if (type == "%") {
                return "PE";
            }
        }
    }
})();