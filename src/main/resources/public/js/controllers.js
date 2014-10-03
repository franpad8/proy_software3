'use strict';

/* Controllers */
myApp.controller('ListarProyectos', ['$scope', '$location', 'myApp.services', function($scope, $location, service) {
        service.getAllProyectos().then(function(object) {
            $scope.proyectos = object.data.data;
            /*INICIO DE PAGINACION*/
            $scope.filteredTodos = []; //es el subset de proyectos a iterar
            $scope.currentPage = 1;
            $scope.numPerPage = 3;
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
                
                /*
                service.getObjeto({"lista_id": JSON.stringify(object.data.proyecto.participantes[i]._id),
                                    "coleccion": "participante", "prueba": "{'_id': '1'}, {'_id': '2'}"}).then(function(object) {
                    $scope.participantes.push(object.data.data);

                });
                 */
            }
            
            //console.log($scope.lista_id);
            service.getObjetosColeccion({"lista_id": $scope.lista_id, "coleccion": "participante" }).then(function(object){
                $scope.participantes = object.data.data; 
            
            });
        });

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
myApp.controller('AsociarComponente', function($scope, $routeParams) {
    $scope.proyecto = getProyect($routeParams.proyectoId);
});