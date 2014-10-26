'use strict';

module.exports = {

    npm: {
        packages: [
            'three@^0.66.4',
            'shelljs@^0.3.0',
            'curlrequest@^0.5.1',
            'adm-zip@^0.4.4',
            'walkdir@0.0.7',
            'mkdirp@^0.5.0',
            'q',
            'underscore'
        ]
    },

    bower: {
        packages: [
            'angular',
            'angular-ui-router',
            'howler.js',
            'Keypress'
        ],
        localFolders: [
            'src/lib'
        ],
        filesNeeded: {
            js: [
                'angular/angular.js',
                'angular-ui-router/release/angular-ui-router.js',
                'howler.js/howler.js',
                'Keypress/keypress.js',

                'lib/game-shim.js',
                'lib/three.js',
                'lib/three-angular.js',
                'lib/howler-angular.js',
                'lib/ammo.js',
                'lib/ammo-angular.js',
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
