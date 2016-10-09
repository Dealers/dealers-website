/**
 * Created by gullumbroso on 27/08/2016.
 */

module.exports = function (grunt) {

    //grunt wrapper function
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ngAnnotate: {
            app: {
                files: {
                    './production/min-safe/app.js': ['./app/app.js'],
                    './production/min-safe/routes.js': ['./app/routes.js'],

                    // Controllers
                    './production/min-safe/js/add-product.controller.js': ['./app/components/controllers/add-product.controller.js'],
                    './production/min-safe/js/add-product-finish.controller.js': ['./app/components/controllers/add-product-finish.controller.js'],
                    './production/min-safe/js/categories-list.controller.js': ['./app/components/controllers/categories-list.controller.js'],
                    './production/min-safe/js/checkout.controller.js': ['./app/components/controllers/checkout.controller.js'],
                    './production/min-safe/js/checkout-finish.controller.js': ['./app/components/controllers/checkout-finish.controller.js'],
                    './production/min-safe/js/crop-photo-dialog.controller.js': ['./app/components/controllers/crop-photo-dialog.controller.js'],
                    './production/min-safe/js/products-grid.controller.js': ['./app/components/controllers/products-grid.controller.js'],
                    './production/min-safe/js/edit-product.controller.js': ['./app/components/controllers/edit-product.controller.js'],
                    './production/min-safe/js/edit-profile.controller.js': ['./app/components/controllers/edit-profile.controller.js'],
                    './production/min-safe/js/home.controller.js': ['./app/components/controllers/home.controller.js'],
                    './production/min-safe/js/navbar.controller.js': ['./app/components/controllers/navbar.controller.js'],
                    './production/min-safe/js/profile.controller.js': ['./app/components/controllers/profile.controller.js'],
                    './production/min-safe/js/purchase-details.controller.js': ['./app/components/controllers/purchase-details.controller.js'],
                    './production/min-safe/js/register-as-dealer.controller.js': ['./app/components/controllers/register-as-dealer.controller.js'],
                    './production/min-safe/js/sign-in-dialog.controller.js': ['./app/components/controllers/sign-in-dialog.controller.js'],
                    './production/min-safe/js/view-deal.controller.js': ['./app/components/controllers/view-deal.controller.js'],
                    './production/min-safe/js/loading-dialog.controller.js': ['./app/components/controllers/loading-dialog.controller.js'],

                    // Directives
                    './production/min-safe/js/general-elements.directives.js': ['app/components/directives/general-elements.directives.js'],
                    './production/min-safe/js/product-directives.js': ['app/components/directives/product-directives.js'],
                    './production/min-safe/js/about.directives.js': ['app/components/directives/about.directives.js'],
                    './production/min-safe/js/elements.directives.js': ['app/components/directives/elements.directives.js'],
                    './production/min-safe/js/widgets.directives.js': ['app/components/directives/widgets.directives.js'],
                    './production/min-safe/js/purchases.directives.js': ['app/components/directives/purchases.directives.js'],
                    './production/min-safe/js/product-edit.directives.js': ['app/components/directives/product-edit.directives.js'],

                    // Services
                    './production/min-safe/js/authentication.service.js': ['app/services/authentication.service.js'],
                    './production/min-safe/js/dealer.service.js': ['app/services/dealer.service.js'],
                    './production/min-safe/js/product.service.js': ['app/services/product.service.js'],
                    './production/min-safe/js/products-grid.service.js': ['app/services/products-grid.service.js'],
                    './production/min-safe/js/product-info.service.js': ['app/services/product-info.service.js'],
                    './production/min-safe/js/product-photos.service.js': ['app/services/product-photos.service.js'],
                    './production/min-safe/js/dealer-photos.service.js': ['app/services/dealer-photos.service.js'],
                    './production/min-safe/js/active-session.service.js': ['app/services/active-session.service.js'],
                    './production/min-safe/js/add-product.service.js': ['app/services/add-product.service.js'],
                    './production/min-safe/js/photos.service.js': ['app/services/photos.service.js'],
                    './production/min-safe/js/edit-product.service.js': ['app/services/edit-product.service.js'],
                    './production/min-safe/js/dialogs.service.js': ['app/services/dialogs.service.js'],
                    './production/min-safe/js/purchase.service.js': ['app/services/purchase.service.js'],
                    './production/min-safe/js/root-dealer-ready.service.js': ['app/services/root-dealer-ready.service.js'],
                    './production/min-safe/js/checkout.service.js': ['app/services/checkout.service.js'],
                    './production/min-safe/js/defaults.service.js': ['app/services/defaults.service.js'],
                    './production/min-safe/js/shipping-methods.service.js': ['app/services/shipping-methods.service.js'],
                }
            }
        },

        concat: {
            js: { //target
                src: ['./production/min-safe/app.js', './production/min-safe/routes.js', './production/min-safe/js/*.js'],
                dest: './production/final/app.js'
            },
            lib: {
                src: ['./production/min-safe/lib/*.js'],
                dest: './production/final/libs.js'
            }
        },

        uglify: {
            js: { //target
                src: ['./production/final/app.js'],
                dest: './production/final/app.js'
            }
        }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //register grunt default task
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify']);
};