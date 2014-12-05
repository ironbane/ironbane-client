angular.module('Ironbane', [
        'angus.templates.app',
        'game.ui',
        'game.game-loop',
        'game.world-root',
        'ces',
        'three',
        'ammo',
        'ammo.physics-world',
        'components',
        'game.scripts',
        'game.prefabs',
        'engine.entity-builder',
        'engine.sound-system',
        'engine.ib-config',
        'engine.input.input-system',
        'engine.util',
        'game.game-socket'
    ])
    .config(function (SoundSystemProvider, $gameSocketProvider, $locationProvider) {
        $gameSocketProvider.setUrl('http://dev.server.ironbane.com:5001');

        // define all of the sounds & music for the game
        SoundSystemProvider.setAudioLibraryData({
            theme: {
                path: 'assets/music/ib_theme',
                volume: 0.55,
                loop: true,
                type: 'music'
            }
        });

        $locationProvider.html5Mode(false);
    })
    .config(function (IbConfigProvider) {
        // Used for input events
        IbConfigProvider.set('domElement', document);
    })
    .run(function ($window, $rootWorld) {

        'use strict';

        // TODO: move to directive
        $rootWorld.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild($rootWorld.renderer.domElement);
        $rootWorld.renderer.setClearColorHex(0xd3fff8);

        $window.addEventListener('resize', function () {
            $rootWorld.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    });
