(function (angular, Ractive) {
    'use strict';

    var watchProps = function (watchMode, $scope, app, properties) {
        var watchFn;
        if(typeof properties !== 'undefined') {
            watchFn = function() {
                var props = {};
                angular.forEach($scope.props, function (propValue, propName) {
                    if(properties.indexOf(propName) > -1) {
                        props[propName] = propValue;
                    }
                });
                return props;
            }
        } else {
            watchFn = function() {
                return $scope.props;
            }
        }
        
        if (watchMode === 'reference') {
            $scope.$watch(watchFn, function (newProps) {
                angular.forEach(newProps, function (propValue, propName) {
                    app.set(propName, propValue);
                });
            });
        } else if (watchMode === 'values') {
            $scope.$watch(watchFn, function (newProps) {
                angular.forEach(newProps, function (propValue, propName) {
                    app.set(propName, propValue);
                });
            }, true);
        } else if (watchMode === 'collection') {
            $scope.$watchCollection(watchFn, function (newProps) {
                angular.forEach(newProps, function (propValue, propName) {
                    app.set(propName, propValue);
                });
            });
        }
    }

    var ngRactiveDecorator = function ($injector) {
        return {
            restrict: 'E',
            scope: {
                name    : "@",
                config  : "=?"
            },
            replace: true,
            transclude: false,
            link: function ($scope, $element, $attrs, $ctrl, $transclude) {
                var elWrapper        = 'ractive-' + $scope.$id;
                var componentWrapper = '<' + elWrapper + ' />';
                var config           = $scope.config || {};

                var baseConfig = {
                    el: elWrapper,
                    data: {
                        getComponent: function (name) {
                            if (!!this.partials[name]) return name;
                            this.partials[name] = '<' + name + '/>';
                            return name;
                        }
                    },
                    staticDelimiters: ['{{::', '}}'],
                    components: {
                        Dynamic: function () {
                            return Ractive.extend({});
                        }
                    },
                    template: $injector.get($attrs.name),
                };

                var appConfig   = angular.extend({}, baseConfig, config);
                var app         = new Ractive(appConfig);

                $scope.$evalAsync(function () {
                    angular.element($element[0]).append(componentWrapper);
                    app.render(elWrapper);
                });

                $scope.$on('$destroy', function () {
                    app.teardown();
                });
            }
        }
    };

    var ngRactiveComponent = function ($injector, $compile, $timeout) {
        return {
            restrict: 'E',
            scope: {
                name        : "@",
                elWrapper   : "@?",
                components  : "=?",
                props       : "=?",
                adaptors    : "=?",
                partials    : "=?",
                watchMode   : "@?",
                watchProp   : "@?",
                twoWayProps : "@?",
                config      : "=?"
            },
            replace: true,
            transclude: false,
            link: function ($scope, $element, $attrs, $ctrl, $transclude) {
                var elWrapper        = $attrs.elWrapper || 'ractive-' + $scope.$id;
                var props            = $scope.props || {};
                var componentWrapper = '<' + elWrapper + '/>';
                var watchMode        = $attrs.watchMode || 'reference';
                var watchProp        = $attrs.watchProp || undefined;
                var config           = $scope.config || {};
                var compileTemplate  = function() {
                    $scope.$applyAsync(function() {
                        $compile($element.contents())($scope);
                    });
                };
                
                if (!$injector.has($attrs.name)) {
                    throw new Error(`Component: ${$attrs.name} does not exists!`);
                }
                
                var baseConfig = {
                    el: $attrs.name,
                    adapt: $scope.adaptors || [],
                    components: $scope.components || {},
                    template: $injector.get($attrs.name),
                    partials: $scope.partials || {},
                    staticDelimiters: ['{{::', '}}']
                };
                var appConfig = angular.extend({}, baseConfig, config);
                var app = new Ractive(appConfig);

                if (Object.keys(props).length > 0) {
                    angular.forEach(props, function (propValue, propName) {
                        app.set(propName, propValue);
                    });
                }

                if (angular.isDefined($attrs.twoWayProps)) {
                    app.observe('*', function (newValue, oldValue, keypath) {
                        $scope.$applyAsync(function () {
                            $scope.props[keypath] = newValue;
                        });
                    });
                }
                
                compileTemplate();
                $scope.$evalAsync(function () {
                    angular.element($element[0]).append(componentWrapper);
                    app.render(elWrapper);
                    watchProps(watchMode, $scope, app, watchProp);
                });

                $scope.$on('$destroy', function () {
                    app.teardown();
                });
            }
        }
    };

    angular.module('ngRactive', [])
        .directive('ngRactiveDecorator', ngRactiveDecorator)
        .directive('ngRactiveComponent', ngRactiveComponent);
        
    if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
        module.exports = "ngRactive";
    }

})(angular, Ractive);