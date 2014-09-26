angular.module('engine.texture-loader', ['three', 'engine.texture-cache'])
    .service('TextureLoader', [
        'THREE',
        '$textureCache',
        '$q',
        function (THREE, $textureCache, $q) {
            'use strict';

            this.getTexture = function (src) {
                var cached = $textureCache.get(src),
                    deferred = $q.defer();

                if (cached) {
                    deferred.resolve(cached);
                } else {
                    THREE.TextureLoader.load(src, function (texture) {
                        $textureCache.put(src, texture);

                        deferred.resolve(texture);
                    }, deferred.notify, deferred.reject);
                }

                return deferred.promise;
            };
        }
    ]);