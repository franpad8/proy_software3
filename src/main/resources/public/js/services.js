'use strict';

/* Services */

myApp.service('myApp.services', ['$http', function($http) {
    this.getAllProyectos = function() {
        return $http.get('proyectos/listar');
    };
    
    this.getObjetosColeccion = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/obtenerObjetosColeccion');
        } else {
          return $http({
            url: 'proyecto/obtenerObjetosColeccion',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.getObjetoColeccion = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('/proyecto/obtenerObjetoColeccion');
        } else {
          return $http({
            url: '/proyecto/obtenerObjetoColeccion',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.getParticipanteByEmail = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('/proyecto/obtenerParticipantePorEmail');
        } else {
          return $http({
            url: '/proyecto/obtenerParticipantePorEmail',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.getObjColec = function(args) {
        
        if(typeof args == 'undefined') {
          return $http.get('proyecto/obtenerObjColec');
        } else {
          return $http({            
            url: 'proyecto/obtenerObjColec',
            method: 'GET',
            params: args
          });
        }
    };
        
    this.getObjColReq = function(args) {
        
        if(typeof args == 'undefined') {
          return $http.get('proyecto/obtenerObjColecReq');
        } else {
          return $http({            
            url: 'proyecto/obtenerObjColecReq',
            method: 'GET',
            params: args
          });
        }
    };
    
    
    this.ABorrar = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/ABorrar');
        } else {
          return $http({
            url: 'proyecto/ABorrar',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.AModificar = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/AModificar');
        } else {
          return $http({
            url: 'proyecto/AModificar',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.Modificar = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/Modificar');
        } else {
          return $http({
            url: 'proyecto/Modificar',
            method: 'GET',
            params: args
          });
        }
    };    
    
    
    this.AProyecto = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/AProyecto');
        } else {
          return $http({
            url: 'proyecto/AProyecto',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.ACarrera = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/ACarrera');
        } else {
          return $http({
            url: 'proyecto/ACarrera',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.AReporte = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/AReporte');
        } else {
          return $http({
            url: 'proyecto/AReporte',
            method: 'GET',
            params: args
          });
        }
    };
    
    
    this.Proyecto = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/Proyecto');
        } else {
          return $http({
            url: 'proyecto/Proyecto',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.Carrera = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/carrera');
        } else {
          return $http({
            url: 'proyecto/carrera',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.Crear = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/Crear');
        } else {
          return $http({
            url: 'proyecto/Crear',
            method: 'GET',
            params: args
          });
        }
    };

    this.APreCrear = function(args) {
        if(typeof args == 'undefined') {
          return $http.get('proyecto/APreCrear');
        } else {
          return $http({
            url: 'proyecto/APreCrear',
            method: 'GET',
            params: args
          });
        }
    };
    
    this.ACrear = function(fProyecto) {
        return  $http({
          url: "proyecto/ACrear",
          data: $.param(fProyecto),
          method: 'POST',
          headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        });
    };
    
    this.AAsociar = function(args) {
        return  $http({
          url: "proyecto/AAsociar",
          method: 'GET',
          params: args
         
        });
    };
    
    this.AAsociarCeremonia = function(args) {
        console.log(args);
        return  $http({
          url: "proyecto/AAsociarCeremonia",
          method: 'GET',
          params: args
         
        });
    };
    
    
    this.AModif = function(fProyecto, args) {
        return  $http({
          url: "proyecto/AModif",
          data: $.param(fProyecto),
          method: 'POST',
          params: args,
          headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        });
    };
        
}]);


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
        value('version', '0.1');
