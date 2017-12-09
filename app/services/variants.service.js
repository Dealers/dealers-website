/**
 * Created by gullumbroso on 21/11/2016.
 */

angular.module('DealersApp')
    .factory('Variants', ['$rootScope', 'Dialogs', '$translate',
        function VariantsFactory($rootScope, Dialogs, $translate) {


            var service = {};

            service.validateVariants = validateVariants;

            $rootScope.$on('$translateChangeSuccess', function () {
                service.NO_OPTIONS_TITLE = $translate.instant("services.variants.no-options-title");
                service.NO_OPTIONS_CONTENT_1 = $translate.instant("services.variants.no-options-content-1");
                service.NO_OPTIONS_CONTENT_2 = $translate.instant("services.variants.no-options-content-2");
            });

            return service;

            /**
             * Validates the variants.
             * @param variants - The variants to validate.
             * @returns {boolean} - True if valid, else false.
             */
            function validateVariants(variants) {
                if (variants) {
                    for (var property in variants) {
                        if (variants.hasOwnProperty(property)) {
                            var name = variants[property].name ? variants[property].name : "";
                            var options = variants[property].options;
                            if (options.length == 0 && name.length > 0) {
                                Dialogs.showAlertDialog(service.NO_OPTIONS_TITLE, service.NO_OPTIONS_CONTENT_1 + name + service.NO_OPTIONS_CONTENT_2);
                                return false;
                            }
                        }
                    }
                }
                return true;
            }

        }]);

