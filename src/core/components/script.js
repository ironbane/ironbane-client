angular.module('components.script', ['ces'])
    .config(function ($componentsProvider) {
        'use strict';

        $componentsProvider.addComponentData({
            'script': {
                scripts: []
            }
        });
    })
    .service('ScriptBank', function($q, $cacheFactory, $http) {
        'use strict';

        var cache = $cacheFactory('scriptCache');

        this.get = function (path) {
            if(cache.get(path)) {
                return $q.when(cache.get(path));
            } else {
                return $http.get(path)
                    .then(function(response) {
                        var Script = eval(response.data);
                        cache.put(path, Script);

                        return Script;
                    }, function(response) {
                        return $q.reject('Ajax Error: ' + path + ' >> ' + response.data);
                    });
            }
        };

        this.add = function (path, Script) {
            cache.put(path, Script);
        };
    })
    .factory('ScriptSystem', function (System, ScriptBank, $log) {
        'use strict';

        var ScriptSystem = System.extend({
            addedToWorld: function (world) {
                var sys = this;

                sys._super(world);

                world.entityAdded('script').add(function (entity) {
                    var scriptData = entity.getComponent('script');

                    // instances are created and stored in _scripts
                    scriptData._scripts = [];
                    angular.forEach(scriptData.scripts, function(scriptPath) {
                        ScriptBank.get(scriptPath)
                            .then(function(Script) {
                                scriptData._scripts.push(new Script(entity, world));
                            }, function(err) {
                                $log.error('Error fetching script! ', scriptPath, err);
                            });
                    });
                });
            },
            update: function (dt, elapsed, timestamp) {
                var world = this.world;

                world.getEntities('script').forEach(function(scripted) {
                    var scripts = scripted.getComponent('script')._scripts;

                    angular.forEach(scripts, function(script) {
                        // update lifecycle for each script
                        if(angular.isFunction(script.update)) {
                            script.update.call(script, dt, elapsed, timestamp);
                        }
                    });
                });
            }
        });

        return ScriptSystem;
    });
