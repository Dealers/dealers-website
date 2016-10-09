/**
 * Created by gullumbroso on 20/09/2016.
 */


/*
 *  Manages information regarding the current session of adding a product.
 */
angular.module('DealersApp')
    .factory('ShippingMethods', ['$http', '$rootScope', 'Dialogs',
        function ShippingMethodsFactory($http, $rootScope, Dialogs) {

            var DELIVERY_PATH = "/deliverys/";
            var EDIT_DELIVERY_PATH = "/editdeliverys/";

            var service = {};

            service.DEALERS_TITLE = "Dealers Express Shipping";
            service.DEALERS_SHIPPING_PRICE = 35; // Shekels
            service.DEALERS_SHIPPING_ETD = 2; // Days
            service.DEALERS_SHIPPING_DESCRIPTION = "This is the standard express shipping.";
            service.DEALERS_METHOD = "Dealers_delivery";
            service.CUSTOM_METHOD = "Other_delivery";
            service.PICKUP_TITLE = "Self Pickup";
            service.PICKUP_METHOD = "Self_pickup";
            service.UPDATE_FINISHED = "shipping_update_update";
            service.updateCounter = 0;

            service.DEFAULT_DEALER_SHIIPPING = {
                selected: false,
                title: service.DEALERS_TITLE,
                shipping_price: service.DEALERS_SHIPPING_PRICE,
                estimated_delivery_time: service.DEALERS_SHIPPING_ETD,
                description: service.DEALERS_SHIPPING_DESCRIPTION
            };

            service.DEFAULT_PICKUP_SHIIPPING = {
                selected: false,
                title: service.PICKUP_TITLE,
                shipping_price: 0,
            };

            service.getDelivery = getDelivery;
            service.convertDeliveryToServer = convertDeliveryToServer;
            service.convertDeliveryFromServer = convertDeliveryFromServer;
            service.parseShippingFromServer = parseShippingFromServer;
            service.mapProductDeliveries = mapProductDeliveries;
            service.updateShippingMethods = updateShippingMethods;
            service.validateShippingMethods = validateShippingMethods;

            return service;

            /**
             * Returns the promise object of the call for the delivery's information form the server.
             * @param deliveryID - The delivery's id.
             * @returns {HttpPromise} - The promise of the call.
             */
            function getDelivery(deliveryID) {
                if (!deliveryID) {
                    console.error("Didn't get a valid delivery id.");
                    return null;
                }
                return $http.get($rootScope.baseUrl + DELIVERY_PATH + '/' + deliveryID + '/');
            }

            /**
             * Converts the values of the delivery object into the server's format.
             * @param delivery - The delivery object.
             * @returns {Delivery} - The converted delivery object.
             */
            function convertDeliveryToServer(delivery) {
                if (delivery.hasOwnProperty("shipping_price")) {
                    delivery.shipping_price *= 100;
                }
                return delivery;
            }

            /**
             * Converts the values of the delivery object into the client's format.
             * @param delivery - The delivery object.
             * @returns {Delivery} - The converted delivery object.
             */
            function convertDeliveryFromServer(delivery) {
                if (delivery.hasOwnProperty("shipping_price")) {
                    delivery.shipping_price /= 100;
                }
                return delivery;
            }

            /**
             * Parses the received object's shipping methods into the client format, and returns it.
             * @param object - the received object to parse.
             */
            function parseShippingFromServer(object) {
                if (!object.hasOwnProperty("dealers_delivery")) {
                    console.error("Error - received an object without deliveries fields.")
                }
                var shippingObject = {
                    dealers: service.DEFAULT_DEALER_SHIIPPING,
                    custom: {selected: false},
                    pickup: service.DEFAULT_PICKUP_SHIIPPING
                };

                if (object.dealers_delivery) {
                    shippingObject.dealers = object.dealers_delivery;
                    shippingObject.dealers.selected = true;
                }
                if (object.custom_delivery) {
                    shippingObject.custom = object.custom_delivery;
                    shippingObject.custom.selected = true;
                }
                if (object.pickup_delivery) {
                    shippingObject.pickup = object.pickup_delivery;
                    shippingObject.pickup.selected = true;
                }

                return shippingObject;
            }

            /**
             * Converts the delivery methods from the server to the client format.
             * @param product - The product to convert.
             * @returns {Product} - The converted product object.
             */
            function mapProductDeliveries(product) {
                if (product.dealers_delivery) {
                    product.dealers_delivery.shipping_price /= 100;
                }
                if (product.custom_delivery) {
                    product.custom_delivery.shipping_price /= 100;
                }
                return product;
            }


            /**
             * Posts the delivery object to the server.
             * @param delivery
             */
            function postDelivery(delivery) {
                if (!delivery) {
                    console.error("No delivery object.");
                }
                service.updateCounter++;
                delivery = convertDeliveryToServer(delivery);
                $http.post($rootScope.baseUrl + EDIT_DELIVERY_PATH, delivery)
                    .then(function (response) {
                        console.log("Posted delivery");
                        successfulUpdate();
                    }, function (err) {
                        console.log("There was an error while updating the delivery method: " + err.data);
                        failedUpdate();
                    });
            }

            /**
             * Patches the delivery object to the server.
             * @param delivery
             */
            function patchDelivery(delivery) {
                if (!delivery) {
                    console.error("No delivery object.");
                }
                service.updateCounter++;
                delivery = convertDeliveryToServer(delivery);
                $http.patch($rootScope.baseUrl + DELIVERY_PATH + delivery.id + '/', delivery)
                    .then(function (response) {
                        console.log("Patched delivery");
                        successfulUpdate();
                    }, function (err) {
                        console.log("There was an error while updating the delivery method: " + err.data);
                        failedUpdate();
                    });
            }

            /**
             * Deletes the delivery object from the server.
             * @param delivery
             */
            function deleteDelivery(delivery) {
                if (!delivery) {
                    console.error("No delivery object.");
                }
                service.updateCounter++;
                $http.delete($rootScope.baseUrl + DELIVERY_PATH + delivery.id + '/')
                    .then(function (response) {
                        console.log("Deleted delivery");
                        successfulUpdate();
                    }, function (err) {
                        console.log("There was an error while deleting the delivery method: " + err.data);
                        failedUpdate();
                    });
            }

            function successfulUpdate() {
                service.updateCounter--;
                if (service.updateCounter <= 0) {
                    $rootScope.$broadcast(service.UPDATE_FINISHED, {success: true});
                }
            }

            function failedUpdate() {
                service.updateCounter = 0;
                $rootScope.$broadcast(service.UPDATE_FINISHED, {success: false});
            }

            /**
             * Updates the shipping method of a product, only after checking that such update is needed (if spotted
             * changes in the objects).
             * @param product - the product.
             * @param shippingMethods - the new shipping methods.
             * @param originalShippingMethods - the original shipping methods.
             */
            function updateShippingMethods(product, shippingMethods, originalShippingMethods) {

                service.updateCounter = 0;

                if (!product) {
                    console.error("No product object.");
                }

                if (product.dealers_delivery) {
                    if (shippingMethods.dealers.selected) {
                        if (!angular.equals(shippingMethods.dealers, originalShippingMethods.dealers)) {
                            patchDelivery(product.dealers_delivery);
                        }
                    } else {
                        deleteDelivery(product.dealers_delivery);
                    }
                } else {
                    if (shippingMethods.dealers) {
                        if (shippingMethods.dealers.selected) {
                            var d_delivery = {
                                delivery_method: service.DEALERS_METHOD,
                                title: shippingMethods.dealers.title,
                                estimated_delivery_time: shippingMethods.dealers.estimated_delivery_time,
                                shipping_price: shippingMethods.dealers.shipping_price,
                                description: shippingMethods.dealers.description,
                                dealers_dealdeliverys: [product.id]
                            };
                            postDelivery(d_delivery);
                        }
                    }
                }
                if (product.custom_delivery) {
                    if (shippingMethods.custom.selected) {
                        if (!angular.equals(shippingMethods.custom, originalShippingMethods.custom)) {
                            patchDelivery(product.custom_delivery);
                        }
                    } else {
                        deleteDelivery(product.custom_delivery);
                    }
                } else {
                    if (shippingMethods.custom) {
                        if (shippingMethods.custom.selected) {
                            var c_delivery = {
                                delivery_method: service.CUSTOM_METHOD,
                                title: shippingMethods.custom.title,
                                estimated_delivery_time: shippingMethods.custom.estimated_delivery_time,
                                shipping_price: shippingMethods.custom.shipping_price,
                                description: shippingMethods.custom.description,
                                custom_dealdeliverys: [product.id]
                            };
                            postDelivery(c_delivery);
                        }
                    }
                }
                if (product.pickup_delivery) {
                    if (shippingMethods.pickup.selected) {
                        if (!angular.equals(shippingMethods.pickup, originalShippingMethods.pickup)) {
                            patchDelivery(product.pickup_delivery);
                        }
                    } else {
                        deleteDelivery(product.pickup_delivery);
                    }
                } else {
                    if (shippingMethods.pickup) {
                        if (shippingMethods.pickup.selected) {
                            var p_delivery = service.DEFAULT_PICKUP_SHIIPPING;
                            p_delivery.delivery_method = service.PICKUP_METHOD;
                            p_delivery.description = shippingMethods.pickup.description;
                            p_delivery.pickup_dealdeliverys = [product.id];
                            postDelivery(p_delivery);
                        }
                    }
                }

                if (service.updateCounter == 0) {
                    // No changes were made, return to the main process.
                    successfulUpdate();
                }
            }

            /**
             * Validates the shipping methods.
             * @param shippingMethods
             * @returns {boolean} true if valid, else false.
             */
            function validateShippingMethods(shippingMethods) {
                var dealersShipping = shippingMethods.dealers;
                var customShipping = shippingMethods.custom;
                var pickup = shippingMethods.pickup;

                if (!dealersShipping) dealersShipping = {};
                if (!customShipping) customShipping = {};
                if (!pickup) pickup = {};

                if (dealersShipping.selected) {
                    if (!dealersShipping.title) {
                        Dialogs.showAlertDialog("Blank Shipping Title", "Please insert a title for your custom shipping method. This is the title that will be presented to your customers when they choose a shipping method.");
                        return false;
                    }
                    if (!(dealersShipping.shipping_price >= 0)) {
                        Dialogs.showAlertDialog("Invalid Shipping Price", "Please insert a valid shipping price.");
                        return false;
                    }
                    if (!(dealersShipping.estimated_delivery_time > 0)) {
                        Dialogs.showAlertDialog("Invalid ETD in Dealers Shipping", "(Something is wrong...)");
                        return false;
                    }
                }
                if (customShipping.selected) {
                    if (!customShipping.title) {
                        Dialogs.showAlertDialog("Blank Shipping Title", "Please insert a title for your custom shipping method. This is the title that will be presented to your customers when they choose a shipping method.");
                        return false;
                    }
                    if (!(customShipping.shipping_price >= 0)) {
                        Dialogs.showAlertDialog("Invalid Shipping Price", "Please insert a valid shipping price in your custom shipping method.");
                        return false;
                    }
                    if (!(customShipping.estimated_delivery_time > 0)) {
                        Dialogs.showAlertDialog("Invalid ETD in Custom Shipping", "Please insert a valid estimated time of delivery (in days).");
                        return false;
                    }
                }
                if (!dealersShipping.selected && !customShipping.selected && !pickup.selected) {
                    Dialogs.showAlertDialog("No Shipping Methods", "You must support at least one shipping method.");
                    return false;
                }

                return true;
            }
        }]);
