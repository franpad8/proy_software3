'use strict';

/* Controllers */
myApp.controller('ListarProyectos', ['$scope','$route', '$cookieStore', '$window', '$timeout','$rootScope', '$location', 'myApp.services', function($scope, $route, $cookieStore, $window, $timeout, $rootScope, $location, service) {
        
          
        
        $scope.proyectos = [];
        $scope.logueado = $cookieStore.get('autenticado_usuario');


        //Si entra en el condicional es que es la primera vez que entramos al sistema
        if (typeof $scope.logueado === 'undefined') {
            $cookieStore.put('autenticado_usuario', false);
            $scope.logueado = false;
        }




        if ($scope.logueado) {
            

            service.getAllProyectos().then(function (object) {
                /* Se extraen todos los proyectos del usuario logueado */
                $scope.nombre_usuario = $cookieStore.get('nombre_usuario');
                 
 
          
                

                $scope.id = $cookieStore.get('id_usuario');
                

                $scope.proyectos = object.data.data;

                /* Se Filtra solo los proyectos en los cuales el usuario participa */
                $scope.proyectos = $scope.proyectos.filter(
                        function (x)
                        {
                            var lista_ids = x.participantes.map(
                                    function (y) {
                                        return y._id.$oid;
                                    });
                            return lista_ids.indexOf($scope.id) > -1;
                        });


                $scope.filteredTodos = []; //es el subset de proyectos a iterar
                $scope.currentPage = 1;
                $scope.numPerPage = 7;
                $scope.maxSize = 5;
                $scope.numPaginas = Math.ceil($scope.proyectos.length / $scope.numPerPage);

                $scope.numPages = function () {
                    return Math.ceil($scope.proyectos.length / $scope.numPerPage);
                };

                $scope.$watch('currentPage + numPerPage', function () {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                            , end = begin + $scope.numPerPage;

                    $scope.filteredTodos = $scope.proyectos.slice(begin, end);
                });


            });



        }

        /* LOGUEO */

        $scope.AIngresar = function (e) {
            var label = "email";
            var arg = {};
            arg[label] = $scope.fIngresarForm.email;
            $scope.fIngresarForm = {};

            service.getParticipanteByEmail(arg).then(function (object) {
                var participanteObtenido = object.data.data;
                if (participanteObtenido !== null) {
                    $cookieStore.put('nombre_usuario', participanteObtenido['nombre']);
                    $cookieStore.put('autenticado_usuario', true);
                    $cookieStore.put('id_usuario', participanteObtenido['_id'].$oid);
                    $scope.logueado = true;

                    $window.location.reload();
                }
                ;
            });

        };

        $scope.ASalir = function (e) {
            $scope.logueado = false;
            $cookieStore.put('autenticado_usuario', false);
            $cookieStore.put('nombre_usuario', undefined);
            $cookieStore.put('id_usuario', undefined);
            $window.location.href= '/';
        };

        


        





        $scope.APreCrear = function () {
            service.APreCrear().then(function (object) {
                $location.path(object.data);
            });
        };

        $scope.AProyecto = function (id) {
            var label = '_id, nombre, participantes, descripcion'.split(/, */)[0];
            var arg = {};
            arg[label] = JSON.stringify(id);
            service.AProyecto(arg).then(function (object) {
                $location.path(object.data);
            });
        };

        $scope.AModificar = function (id) {
            var label = '_id, nombre, participantes, descripcion'.split(/, */)[0];
            var arg = {};
            arg[label] = JSON.stringify(id);
            service.AModificar(arg).then(function (object) {
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
myApp.controller('VerProyecto', ['$route','$scope', '$location', '$routeParams', 'myApp.services', function($route, $scope, $location, $routeParams, service) {
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
            
            //Esto es de carreras 
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
            
            //Esto es de requisitos 
            $scope.res = object.data;
            $scope.requisitos = [];
            $scope.req_id = "";
            for (var key in object.data) {
                $scope[key] = object.data[key];
            }
            $scope.num_req = object.data.proyecto['requisitos'].length;
            
            for (var i = 0; i < $scope.num_req; i++) {
                $scope.req_id = $scope.req_id.concat("{$oid: '");       
                $scope.req_id = $scope.req_id.concat(object.data.proyecto.requisitos[i]._id.$oid);
                $scope.req_id = $scope.req_id.concat("'");       
                if (i !== $scope.num_req-1)
                    $scope.req_id = $scope.req_id.concat("},");
                else
                    $scope.req_id = $scope.req_id.concat("}");
                
                               
            }
            
            
                service.getObjColReq({"lista_id": $scope.req_id, "coleccion": "requisito"}).then(function (object) {

                $scope.requisitos = object.data.data;
            });
            
        });
        
          
        

         $scope.ACarrera = function(id,numero) {
            
            var label = '_id, nombre, participantes, descripcion'.split(/, */)[0];
            var arg = {};
            arg[label] = JSON.stringify(id);
            $location.path('/ACarrera/' + JSON.stringify(id) + '/' + numero);
            
        };

        $scope.fAsociar = {};
        $scope.submitted = false;
        
        $scope.AAsociar = function(isValid, id) {
            $scope.submitted = true;
            console.log("ID en controladorProy"+JSON.stringify(id));
            if (isValid) {
                service.AAsociar({"id_proy": JSON.stringify(id), "nombre": ($scope.fAsociar.nombre), "prioridad": ($scope.fAsociar.prioridad)}).then(function(object) {
                });
            }
            $route.reload();
        };

        $scope.modificarRequisito = function(requisito_nombre,requisito_prioridad){
            $scope.fAsociar.nombre = requisito_nombre;
            $scope.fAsociar.prioridad = requisito_prioridad;           
            $scope.showAdd = true;
            
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


myApp.controller('VerReporte', ['$rootScope', '$route','$scope', '$cookieStore', '$location', '$routeParams', 'myApp.services', function ($rootScope,$route,$scope, $cookieStore, $location, $routeParams, service) {
        $scope.tipo = $routeParams.tipo;
        $scope.aux = {'1':"Planificacion de Carrera", '2':"Careos Diarios", '3':"Evaluacion de Carrera", '4':"Retrospectiva"}
        $scope.nombre = $scope.aux[$scope.tipo];
        $scope.lista = [];
        $scope.nroMostradosPorPagina = 2;
        $scope.nroMostrados = $scope.nroMostradosPorPagina;
        $scope.tamanioListaReportes = 0;
        $scope.necesitaPaginacion = false;
        $scope.quedan = true;
        
        var label = '_id, coleccion'.split(/, */);
        var arg = {};
        arg[label[0]] = $routeParams._id;
        arg[label[1]] = 'carrera';
        
        /* Obtenemos las ceremonias de la carrera */
        service.getObjetoColeccion(arg).then(function (object) {

            //Obtenemos el resultado del servicio con todas las ceremonias de la carrera 
            $scope.ceremonias = object.data.data.ceremonias;
            
            //Filtramos por tipo de ceremonia
            $scope.ceremonias = $scope.ceremonias.filter(function(x){return x.tipo===$scope.tipo;});
            
            //Almacenamos el numero de reportes
            $scope.tamanioListaReportes = $scope.ceremonias.length;
            
            //Determinamos si se necesita paginación
            $scope.necesitaPaginacion = $scope.ceremonias.length > $scope.nroMostradosPorPagina;
            
      
            /* parseamos todas las fechas de texto plano al formato para mostrarlas en el template*/
            for (var i=0; i < $scope.ceremonias.length; i++){
                $scope.ceremonias[i].fecha = Date.parse($scope.ceremonias[i].fecha);
                
            };
            
            // Ordenamos las ceremonias por fechas 
            $scope.ceremonias.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
            return b.fecha - a.fecha;
            });
            
            $scope.lista = $scope.ceremonias.slice(0, $scope.nroMostrados);
            
           
        });
        
        $scope.cargarMas = function(e){
          $scope.nroMostrados += $scope.nroMostradosPorPagina;
          $scope.lista = $scope.ceremonias.slice(0, $scope.nroMostrados);
          if($scope.nroMostrados >= $scope.tamanioListaReportes)
              $scope.quedan = false;
        };
        $scope.cargarMenos = function(e){       
          $scope.nroMostrados = $scope.nroMostradosPorPagina;
          $scope.lista = $scope.ceremonias.slice(0, $scope.nroMostrados);
          $scope.quedan = true;
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        };
        
        $scope.AAsociarCeremonia = function(isValid) {
            $scope.submitted = true;
            if (isValid) {
                service.AAsociarCeremonia({"_id": $routeParams._id, "tipo": $scope.tipo, "usuario": $cookieStore.get('nombre_usuario'),
                                            "reporte":$scope.fAsociarCeremonia.reporte, "fecha": new Date()}).then(function(object) {
                                            $route.reload();
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