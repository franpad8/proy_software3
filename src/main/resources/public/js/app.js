'use strict';

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['ngRoute', 'ngCookies']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
                controller: 'ListarProyectos',
                templateUrl: 'views/ListarProyectos.html'
            }).when('/ListarProyectos', {
                controller: 'ListarProyectos',
                templateUrl: 'views/ListarProyectos.html'
            }).when('/VerProyecto/:_id', {
                controller: 'VerProyecto',
                templateUrl: 'views/VerProyecto.html'
            }).when('/Crear', {
                controller: 'CrearProyecto',
                templateUrl: 'views/CrearProyecto.html'
            }).when('/ModificarProyecto/:_id', {
                controller: 'ModificarProyecto',
                templateUrl: 'views/ModificarProyecto.html'
            }).when('/BorrarProyecto/:proyectoId', {
                controller: 'BorrarProyecto',
                templateUrl: 'views/BorrarProyecto.html'
            }).when('/ACarrera/:_id/:numero', {
                controller: 'Carrera',
                templateUrl: 'views/VerCarrera.html'
            }).when('/AReporte/:_id/:tipo', {
                controller: 'VerReporte',
                templateUrl: 'views/VerReporte.html'
            });
}]);
//});

myApp.directive('barChart', function(){
            var chart = d3.custom.barChart();
            return {
                restrict: 'E',
                replace: true,
                template: '<div class="chart"></div>',
                scope:{
                    height: '=height',
                    data: '=data',
                    hovered: '&hovered'
                },
                link: function(scope, element, attrs) {
                    var chartEl = d3.select(element[0]);
                    chart.on('customHover', function(d, i){
                        scope.hovered({args:d});
                    });

                    scope.$watch('data', function (newVal, oldVal) {
                        chartEl.datum(newVal).call(chart);
                    });

                    scope.$watch('height', function(d, i){
                        chartEl.call(chart.height(scope.height));
                    });
                }
            };
        });
        myApp.directive('chartForm', function(){
            return {
                restrict: 'E',
                replace: true,
//                controller: function AppCtrl ($scope) {
//                    $scope.update = function(d, i){ $scope.data = randomData(); };
//                    function randomData(){
//                        return d3.range(~~(Math.random()*50)+1).map(function(d, i){return ~~(Math.random()*1000);});
//                    }
//                },
                template: '<div class="form">' +
//                        'Height: {{options.height}}<br />' +
//                        '<input type="range" ng-model="options.height" min="300" max="300"/>' +
                        '<button type="button" class="btn btn-primary" ng-click="options.height = 301">Ver Grafica</button>'+
                        '<br />Nota: Coloque el cursor sobre la barra para ver detalles de una tarea.'+
                        '<br />Peso: {{barValue.peso}} '+
                        '<br />Estado: {{barValue.estado}}</div> '
            };
        });