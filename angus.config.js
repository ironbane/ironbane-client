'use strict';

module.exports = {

    bower: {
        packages: [
            'angular'
        ],
        filesNeeded: {
            js: [
                'angular/angular.js'
            ],

            less: [],

            /*
                html - Only for AngularJS apps: include html templates here to cache them.
                This array must contain objects in the following format:

                {
                   libPath: 'angular-ui/template/modal/backdrop.html',
                   readAs: 'template/modal/backdrop.html'
                }
            */
            html: []
        }
    },

    // The port this app will be accessible on.
    // Defaults to 9000
    port: 9000,

    // Which CSS compiler to use. Can be 'none', 'sass' or 'less'.
    // Defaults to 'sass'
    cssCompiler: 'less',

    // Which test runner to use. Can be 'none' or 'karma'.
    // Defaults to 'karma'
    testRunner: 'karma',

    // Whether JsHint should check your code for errors.
    // Note that you need a .jshintrc file in your project directory for this to work.
    // See the example apps for a good starting point.
    // Defaults to true
    useJsHint: true,

    // When enabled, Angus will execute a few additional tasks such as html2js, ngconstant and ngmin.
    // Defaults to false
    usesAngularJS: true

};
