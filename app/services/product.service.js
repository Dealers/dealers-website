angular.module('DealersApp')
    .factory('Product', ['$http', '$rootScope', 'ShippingMethods', function ProductFactory($http, $rootScope, ShippingMethods) {

        var ctrl = this;
        var service = {};

        var currencies = {
            'USD': '$',
            'ILS': '₪',
            'CNY': '¥',
            'GBP': '£',
            'EUR': '€'
        };

        var categories = {
            "Fa": "Fashion",
            "Au": "Automotive",
            "Ar": "Art",
            "Be": "Health & Beauty",
            "Bo": "Books & Magazines",
            "El": "Electronics",
            "En": "Entertainment & Events",
            "Fo": "Food & Groceries",
            "Ho": "Home & Furniture",
            "Ki": "Kids & Babies",
            "Mu": "Music",
            "Pe": "Pets",
            "Re": "Restaurants & Bars",
            "Se": "Services",
            "Sp": "Sports & Outdoor",
            "Tr": "Travel",
            "Ot": "Other"
        };

        service.getProduct = getProduct;
        service.getProducts = getProducts;
        service.deleteProduct = deleteProduct;
        service.buyProduct = buyProduct;
        service.removePhotoPaths = removePhotoPaths;

        service.mapData = mapData;
        service.unStringifyObject = unStringifyObject;
        service.categoryForKey = categoryForKey;
        service.keyForCategory = keyForCategory;
        service.currencyForKey = currencyForKey;
        service.keyForCurrency = keyForCurrency;
        service.convertKeysToCurrencies = convertKeysToCurrencies;
        service.discountTypeForKey = discountTypeForKey;
        service.keyForDiscountType = keyForDiscountType;
        service.areEqual = areEqual;
        service.parseVariantsToServer = parseVariantsToServer;
        service.parseVariantsFromServer = parseVariantsFromServer;
        service.extractData = extractData;

        return service;

        /**
         * Returns a call for a specific product form the server
         */
        function getProduct(productID) {
            if (productID) {
                return $http.get($rootScope.baseUrl + '/alldeals/' + String(productID) + '/');
            }
        }

        /**
         * Returns a call for a list of products form the server
         */
        function getProducts(url) {
            return $http.get(url);
        }

        function deleteProduct(url) {
            return $http.delete(url);
        }

        /**
         * Sends the buy request to the server and from there to Stripe.
         * @param charge - the charge object.
         * @returns {promise} - the promise object of the post method.
         */
        function buyProduct(charge) {
            return $http.post($rootScope.baseUrl + '/transactions/', charge);
        }

        /**
         * Returns the received product without the photo's paths properties.
         * @param product - the received product.
         * @returns {product} the "photo pathless" product.
         */
        function removePhotoPaths(product) {
            if (product.hasOwnProperty("photo1")) {
                delete product["photo1"];
            }
            if (product.hasOwnProperty("photo2")) {
                delete product["photo2"];
            }
            if (product.hasOwnProperty("photo3")) {
                delete product["photo3"];
            }
            if (product.hasOwnProperty("photo4")) {
                delete product["photo4"];
            }
            return product;
        }

        /**
         * Converts the keys of the server to regular strings, and returns the updated product.
         */
        function mapData(product) {
            if (product.category) {
                var category = categoryForKey(product.category);
                if (category) {
                    product.category = category;
                }
            }
            if (product.currency) {
                if (product.currency.length == 3) {
                    product.currency = currencyForKey(product.currency);
                }
            }
            if (product.discount_type) {
                if (product.discount_type.length == 2) {
                    product.discount_type = discountTypeForKey(product.discount_type);
                }
            }
            if (product.expiration) {
                if (typeof product.expiration == "string") {
                    product.expiration = new Date(product.expiration);
                }
            }
            product = ShippingMethods.mapProductDeliveries(product);
            return product;
        }

        /**
         * Parses the string representation of the product object into a valid product object with various value types.
         * @param product - the product to parse.
         * @returns {product} - a new valid product object.
         */
        function unStringifyObject(product) {
            if (product.id) {
                product.id = parseInt(product.id);
            }
            if (product.dealer) {
                if (product.dealer.id) {
                    product.dealer.id = parseInt(product.dealer.id);
                }
            }
            if (product.price) {
                product.price = parseFloat(product.price);
            }
            if (product.percentage_off) {
                product.percentage_off = parseFloat(product.percentage_off);
            }
            if (product.original_price) {
                product.original_price = parseFloat(product.original_price);
            }
            if (product.max_quantity) {
                product.max_quantity = parseInt(product.max_quantity);
            }
            if (product.expiration) {
                product.expiration = new Date(product.expiration);
            }
            if (product.upload_date) {
                product.upload_date = new Date(product.upload_date);
            }
            if (product.main_photo_width) {
                product.main_photo_width = parseInt(product.main_photo_width);
            }
            if (product.main_photo_height) {
                product.main_photo_height = parseInt(product.main_photo_height);
            }

            return product;
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
            if (key) {
                if (key.length == 3)
                    return currencies[key];
            }
            return key;
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
         * Converts the server keys currencies in the received object to presentable currencies.
         *
         * @param currArray - an array with objects that contain a currency field.
         * @returns {Array} the received array with with converted objects.
         */
        function convertKeysToCurrencies(currArray) {
            for (var i = 0; i < currArray.length; i++) {
                var currKey = currArray[i].currency;
                currArray[i].currency = currencyForKey(currKey);
            }
            return currArray;
        }

        /**
         * Returns the discount type that matches the server key.
         * @param key - the server key.
         * @returns {string} the matching discount type.
         */
        function discountTypeForKey(key) {
            if (key == "PP") {
                return "123";
            } else if (key == "PE") {
                return "%";
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

        /**
         * Determines if 2 products are equal, according to specific fields (those who are editable).
         * @param product1 - the first product.
         * @param product2 - the second product.
         * @returns {boolean} - true if equal, else false.
         */
        function areEqual(product1, product2) {
            if (product1.title != product2.title) {
                return false;
            }
            if (product1.price != product2.price) {
                return false;
            }
            if (product1.currency != product2.currency) {
                return false;
            }
            if (product1.discount_value != product2.discount_value) {
                return false;
            }
            if (product1.discount_type != product2.discount_type) {
                return false;
            }
            if (product1.category != product2.category) {
                return false;
            }
            if (product1.expiration != product2.expiration) {
                return false;
            }
            if (product1.more_description != product2.more_description) {
                return false;
            }
            if (product1.more_description != product2.more_description) {
                return false;
            }
            return true;
        }

        /**
         * Parses the variants of the product to the server format.
         * @param variants - the variants to parse.
         * @returns {Array} - the parsed variants array.
         */
        function parseVariantsToServer(variants) {
            var parsedVariants = [];
            var variant = {};
            for (var property in variants) {
                if (variants.hasOwnProperty(property)) {
                    variant.name = variants[property].name;
                    variant.options = [];
                    var options = variants[property].options;
                    for (var j = 0; j < options.length; j++) {
                        variant.options.push({"option": variants[property].options[j]});
                    }
                    parsedVariants.push(variant);
                    variant = {};
                }
            }
            return parsedVariants;
        }

        /**
         * Parses the variants of the product to the front format.
         * @param variants - the variants to parse.
         * @returns {variants} - the parsed variants.
         */
        function parseVariantsFromServer(variants) {
            var parsedVariants = {};
            var variant = {};
            var counter = 0;
            for (var i = 0; i < variants.length; i++) {
                var curVar = variants[i];
                variant.name = curVar.name;
                variant.options = [];
                for (var j = 0; j < curVar.options.length; j++) {
                    variant.options.push(curVar.options[j].option);
                }
                parsedVariants[counter] = variant;
                variant = {};
                counter++;
            }
            return parsedVariants;
        }

        /**
         * Remove the raw photos data in order to separate between the photos of the product (that goes to s3) and the
         * actual data that is uploaded to the server.
         * @param product - the product that should be extracted.
         */
        function extractData(product) {
            var extracted = $.extend(true, {}, product);
            delete extracted.photos;
            return extracted;
        }
    }]);