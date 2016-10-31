/**
 * Created by gullumbroso on 27/08/2016.
 */

module.exports = function (grunt) {

    //grunt wrapper function
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            js: { //target
                src: ['./assets/lib/js/*.js', './app/*.js', './app/components/controllers/*.js', './app/components/directives/*.js',
                    './app/services/*.js'],
                dest: './production/prepare/app.concat.js'
            },
            css: {
                src: ['./assets/css/animations.css', './assets/css/styles.css', './assets/css/rtl-styles.css', './assets/lib/css/angular-datepicker.css',
                './assets/lib/css/animate.css'],
                dest: './production/prepare/styles.concat.css'
            }
        },

        ngAnnotate: {
            app: {
                files: {
                    './production/prepare/app.min-safe.js': './production/prepare/app.concat.js'
                }
            }
        },

        uglify: {
            js: { //target
                src: ['./production/prepare/app.min-safe.js'],
                dest: './production/final/app.min.js'
            }
        },

        cssmin: {
            css: {
                src: ['./production/prepare/styles.concat.css', './production/prepare/rtl-styles.concat.css'],
                dest: './production/final/styles.min.css'
            }
        }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //register grunt default task
    grunt.registerTask('default', ['concat', 'ngAnnotate', 'uglify', 'cssmin']);
};