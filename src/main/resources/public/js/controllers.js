'use strict';

/* Controllers */
myApp.controller('ListarProyectos', ['$scope', '$location', 'myApp.services', function($scope, $location, service) {
        service.getAllProyectos().then(function(object) {
            
            
            
            
            
            $scope.proyectos = object.data.data;
            /*INICIO DE PAGINACION*/
            $scope.filteredTodos = []; //es el subset de proyectos a iterar
            $scope.currentPage = 1;
            $scope.numPerPage = 7;
            $scope.maxSize = 5;
            $scope.numPaginas = Math.ceil($scope.proyectos.length / $scope.numPerPage);

            $scope.numPages = function() {
                return Math.ceil($scope.proyectos.length / $scope.numPerPage);
            };

            $scope.$watch('currentPage + numPerPage', function() {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                $scope.filteredTodos = $scope.proyectos.slice(begin, end);
            });

        });

        $scope.APreCrear = function() {
            service.APreCrear().then(function(object) {
                $location.path(object.data);
            });
        };

        $scope.AProyecto = function(id) {
            var label = '_id, nombre, participantes, descripcion'.split(/, */)[0];
            var arg = {};
            arg[label] = JSON.stringify(id);
            service.AProyecto(arg).then(function(object) {
                $location.path(object.data);
            });
        };

        $scope.AModificar = function(id) {
            var label = '_id, nombre, participantes, descripcion'.split(/, */)[0];
            var arg = {};
            arg[label] = JSON.stringify(id);
            service.AModificar(arg).then(function(object) {
                $location.path(object.data);
            });
        };
    }]);
myApp.controller('CrearProyecto', ['$scope', '$location', 'myApp.services', function($scope, $location, service) {
        /* $scope.proy = '';
         service.Crear().then(function (object) {
         $scope.res = object.data;
         for (var key in object.data) {
         $scope[key] = object.data[key];
         }
         });*/

        $scope.fProyecto = {};
        $scope.submitted = false;
        $scope.ACrear = function(isValid) {
            $scope.submitted = true;
            if (isValid) {
                service.ACrear($scope.fProyecto).then(function(object) {
                    $location.path(object.data);
                });
            }
        };
    }]);
myApp.controller('AsociarComponente', ['$scope', '$location', 'myApp.services', function($scope, $location, service) {
        /* $scope.proy = '';
         service.Crear().then(function (object) {
         $scope.res = object.data;
         for (var key in object.data) {
         $scope[key] = object.data[key];
         }
         });*/

        $scope.fAsociar = {};
        $scope.submitted = false;
        $scope.AAsociar = function(isValid) {
            $scope.submitted = true;
            if (isValid) {
                service.AAsociar($scope.fAsociar).then(function(object) {
                    $location.path(object.data);
                });
            }
        };
    }]);
myApp.controller('VerProyecto', ['$scope', '$location', '$routeParams', 'myApp.services', function($scope, $location, $routeParams, service) {
        $scope.proy = '';
        $scope.participantes = [];


        service.Proyecto({"_id": $routeParams._id}).then(function(object) {
            $scope.res = object.data;
            $scope.lista_id = "";
            $scope.participantes = [];

            for (var key in object.data) {
                $scope[key] = object.data[key];
            }
            $scope.num_participantes = object.data.proyecto['participantes'].length;
            for (var i = 0; i < $scope.num_participantes; i++) {
                $scope.lista_id = $scope.lista_id.concat("{$oid: '");       
                $scope.lista_id = $scope.lista_id.concat(object.data.proyecto.participantes[i]._id.$oid);
                $scope.lista_id = $scope.lista_id.concat("'");       
                if (i !== $scope.num_participantes-1)
                    $scope.lista_id = $scope.lista_id.concat("},");
                else
                    $scope.lista_id = $scope.lista_id.concat("}");
                
            }
            
            //console.log("Participantes <- "+ $scope.lista_id);
            service.getObjetosColeccion({"lista_id": $scope.lista_id, "coleccion": "participante" }).then(function(object){
                $scope.participantes = object.data.data; 
                    
            });
            
        });
        
        service.Proyecto1({"_id": $routeParams._id}).then(function(object) {
            $scope.res = object.data;
            $scope.carreras = [];
            $scope.lista_id = "";
            for (var key in object.data) {
                $scope[key] = object.data[key];
            }
            $scope.num_carreras = object.data.proyecto['carreras'].length;
            
            for (var i = 0; i < $scope.num_carreras; i++) {
                $scope.lista_id = $scope.lista_id.concat("{$oid: '");       
                $scope.lista_id = $scope.lista_id.concat(object.data.proyecto.carreras[i]._id.$oid);
                $scope.lista_id = $scope.lista_id.concat("'");       
                if (i !== $scope.num_carreras-1)
                    $scope.lista_id = $scope.lista_id.concat("},");
                else
                    $scope.lista_id = $scope.lista_id.concat("}");
                
                               
            }
            
            
            service.getObjColec({"lista_id": $scope.lista_id, "coleccion": "carrera"}).then(function (object) {

                $scope.carreras = object.data.data;
            });
        });     
        
        
        
        //var label = '_id,colleccion'.split(/, */);
        //var arg = {};
        //arg[label[0]] = $routeParams._id;
        //arg[label[1]] = 'carrera';
        //console.log("Holaaa -> " + arg[label[0]] + arg[label[1]]);
        //service.getObjColec(arg[label[0]],arg[label[1]]).then(function (object) {
        //    console.log("Holaaa " + object);
        //    $scope.carreras = object.data.data.carreras;
        //});
        
        
        
         $scope.ACarrera = function(id,numero) {
            
            var label = '_id, nombre, participantes, descripcion'.split(/, */)[0];
            var arg = {};
            arg[label] = JSON.stringify(id);
            $location.path('/ACarrera/' + JSON.stringify(id) + '/' + numero);
            
        };

        $scope.fAsociar = {};
        $scope.submitted = false;
        
        $scope.AAsociar = function(isValid) {
            $scope.submitted = true;
            if (isValid) {
                service.AAsociar({"nombre": ($scope.proyecto.nombre), "requisito": ($scope.fAsociar.nombre), "prioridad": ($scope.fAsociar.prioridad)}).then(function(object) {
                });
            }
        };

        




        $scope.ABorrar = function(_id) {
            service.ABorrar({"_id": JSON.stringify(_id)}).then(function(object) {
                $location.path(object.data);
            });
        };

    }]);
myApp.controller('ModificarProyecto', ['$scope', '$location', '$routeParams', 'myApp.services', function($scope, $location, $routeParams, service) {
        $scope.proy = '';
        service.Modificar({"_id": $routeParams._id}).then(function(object) {
            $scope.res = object.data;
            for (var key in object.data) {
                $scope[key] = object.data[key];
            }
        });


        $scope.proyecto = {};
        $scope.submitted = false;
        $scope.AModif = function(isValid) {
            $scope.submitted = true;
            if (isValid) {
                service.AModif($scope.proyecto, {"_id": $routeParams._id}).then(function(object) {
                    $location.path(object.data);
                });
            }
        };
    }]);
myApp.controller('BorrarProyecto', function($scope, $routeParams) {
    $scope.proyecto = getProyect($routeParams.proyectoId);
});

myApp.controller('VerReporte', ['$scope', '$location', '$routeParams', 'myApp.services', function ($scope, $location, $routeParams, service) {
        $scope.tipo = $routeParams.tipo;
        $scope.aux = {'1':"Planificacion de Carrera", '2':"Careos Diarios", '3':"Evaluacion de Carrera", '4':"Retrospectiva"}
        $scope.nombre = $scope.aux[$scope.tipo];
        
        var label = '_id, coleccion'.split(/, */);
        var arg = {};
        arg[label[0]] = $routeParams._id;
        arg[label[1]] = 'carrera';
        
        /* Obtenemos la ceremonia de la carrera */
        service.getObjetoColeccion(arg).then(function (object) {

            $scope.ceremonias = object.data.data.ceremonias;
      
            /* parseamos todas las fechas de texto plano al formato para mostrarlas en el template*/
            for (var i=0; i < $scope.ceremonias.length; i++){
                $scope.ceremonias[i].fecha = Date.parse($scope.ceremonias[i].fecha);
                
            };
            
           
        });
        
        
        $scope.AAsociarCeremonia = function(isValid) {
            $scope.submitted = true;
            if (isValid) {
                service.AAsociarCeremonia({"_id": $routeParams._id, "tipo": $scope.tipo, "usuario": $scope.fAsociarCeremonia.usuario,
                                            "reporte":$scope.fAsociarCeremonia.reporte, "fecha": new Date()}).then(function(object) {
                });
            }
        };

    }]);


myApp.controller('Carrera', ['$scope', '$location', '$routeParams', 'myApp.services', function($scope, $location, $routeParams, service) {
   $scope.nombre = $routeParams._id;
   $scope.numero = $routeParams.numero;
   $scope.ruta='';
        $scope.AReporte = function (id, tipo) {    
            $location.path('/AReporte/' + id + '/' + tipo);
            
        };
}]);


myApp.controller('AsociarComponente', function($scope, $routeParams) {
    $scope.proyecto = getProyect($routeParams.proyectoId);
});