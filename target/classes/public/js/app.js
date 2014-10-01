'use strict';

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['ngRoute']);

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
            }).when('/AsociarComponente/:proyectoId', {
                controller: 'AsociarComponente',
                templateUrl: 'views/AsociarComponente.html'
            });
}]);
//});
