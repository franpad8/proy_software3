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
                                        return y.$oid;
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

myApp.controller('VerProyecto', ['$route','$scope', '$window','$location', '$routeParams', 'myApp.services', function($route, $scope, $window, $location, $routeParams, service) {

        $scope.proy = '';
        $scope.participantes = [];
        
        
        
        //PARA LA PAGINACIÓN DE PARTICIPANTES
        $scope.nroPartsMostradosPorPagina = 2;
        $scope.nroPartsMostrados = $scope.nroPartsMostradosPorPagina;
        $scope.tamanioListaParts = 0;
        $scope.necesitaPaginacionParts = false;
        $scope.quedanMasParts = true;
        $scope.quedanMenosParts = false;
        $scope.nroPaginasParts = 0;
        $scope.nroPaginaActualParts = 1;
        //
        
        //PARA LA PAGINACIÓN DE REQUISITOS
        $scope.nroReqsMostradosPorPagina = 3;
        $scope.nroReqsMostrados = $scope.nroReqsMostradosPorPagina;
        $scope.tamanioListaReqs = 0;
        $scope.necesitaPaginacionReqs = false;
        $scope.quedanMasReqs = true;
        $scope.quedanMenosReqs = false;
        $scope.nroPaginasReqs = 0;
        $scope.nroPaginaActualReqs = 1;
        //
        
         //PARA LA PAGINACIÓN DE CARRERAS
        $scope.nroCarrsMostradosPorPagina = 1;
        $scope.nroCarrsMostrados = $scope.nroCarrsMostradosPorPagina;
        $scope.tamanioListaCarrs = 0;
        $scope.necesitaPaginacionCarrs = false;
        $scope.quedanMasCarrs = true;
        $scope.quedanMenosCarrs = false;
        $scope.nroPaginasCarrs = 0;
        $scope.nroPaginaActualCarrs = 1;
        //

        service.Proyecto({"_id": $routeParams._id}).then(function(object) {
            $scope.res = object.data;
            $scope.lista_id = "";
            $scope.participantes = [];

            for (var key in object.data) {
                $scope[key] = object.data[key];
            }
            
            $scope.num_participantes = object.data.proyecto['participantes'].length;
            
            //PARA LA PAGINACIÓN DE PARTICIPANTES
            $scope.tamanioListaParts = $scope.num_participantes;
            $scope.nroPaginasParts = Math.ceil($scope.tamanioListaParts/$scope.nroPartsMostradosPorPagina);
            $scope.necesitaPaginacionParts = $scope.tamanioListaParts > $scope.nroPartsMostradosPorPagina;
            //
            
            
            for (var i = 0; i < $scope.num_participantes; i++) {
                $scope.lista_id = $scope.lista_id.concat("{$oid: '");       
                $scope.lista_id = $scope.lista_id.concat(object.data.proyecto.participantes[i].$oid);
                $scope.lista_id = $scope.lista_id.concat("'");       
                if (i !== $scope.num_participantes-1)
                    $scope.lista_id = $scope.lista_id.concat("},");
                else
                    $scope.lista_id = $scope.lista_id.concat("}");
                
            }
            
            //console.log("Participantes <- "+ $scope.lista_id);
            service.getObjetosColeccion({"lista_id": $scope.lista_id, "coleccion": "participante" }).then(function(object){
                $scope.participantes = object.data.data; 
                
                
                
                //PARA LA PAGINACIÓN DE PARTICIPANTES
                $scope.listaParts = $scope.participantes.slice(0, $scope.nroPartsMostrados);          
                //
                
                    
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
                $scope.lista_id = $scope.lista_id.concat(object.data.proyecto.carreras[i].$oid);
                $scope.lista_id = $scope.lista_id.concat("'");       
                if (i !== $scope.num_carreras-1)
                    $scope.lista_id = $scope.lista_id.concat("},");
                else
                    $scope.lista_id = $scope.lista_id.concat("}");
                
                               
            }
            
            
            service.getObjColec({"lista_id": $scope.lista_id, "coleccion": "carrera"}).then(function (object) {

                $scope.carreras = object.data.data;
                
                //PARA LA PAGINACIÓN DE REQUISITOS
                $scope.tamanioListaCarrs = $scope.carreras.length;
                $scope.nroPaginasCarrs = Math.ceil($scope.tamanioListaCarrs/$scope.nroCarrsMostradosPorPagina);
                $scope.necesitaPaginacionCarrs = $scope.tamanioListaCarrs > $scope.nroCarrsMostradosPorPagina;

                $scope.listaCarrs = $scope.carreras.slice(0, $scope.nroCarrsMostrados);          

                 //
                
                
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
                $scope.req_id = $scope.req_id.concat(object.data.proyecto.requisitos[i].$oid);
                $scope.req_id = $scope.req_id.concat("'");       
                if (i !== $scope.num_req-1)
                    $scope.req_id = $scope.req_id.concat("},");
                else
                    $scope.req_id = $scope.req_id.concat("}");
                
                               
            }
            
            
                service.getObjetosColeccion({"lista_id": $scope.req_id, "coleccion": "requisito"}).then(function (object) {

                $scope.requisitos = object.data.data;
                
                //PARA LA PAGINACIÓN DE REQUISITOS
                $scope.tamanioListaReqs = $scope.requisitos.length;
                $scope.nroPaginasReqs = Math.ceil($scope.tamanioListaReqs/$scope.nroReqsMostradosPorPagina);
                $scope.necesitaPaginacionReqs = $scope.tamanioListaReqs > $scope.nroReqsMostradosPorPagina;

                $scope.listaReqs = $scope.requisitos.slice(0, $scope.nroReqsMostrados);          

                 //
                
                
            });
            
        });
        
        
        
        //PARA PAGINACIÓN DE PARTICIPANTES
        $scope.cargarMasParts = function(e){
          var ini = $scope.nroPartsMostrados;
          $scope.nroPartsMostrados += $scope.nroPartsMostradosPorPagina;
          var fin = $scope.nroPartsMostrados;;
          $scope.listaParts = $scope.participantes.slice(ini, fin);
          $scope.quedanMenosParts = true;
          $scope.nroPaginaActualParts += 1;
          if($scope.nroPartsMostrados >= $scope.tamanioListaParts){
              $scope.quedanMasParts = false;
              $scope.nroPartsMostrados = $scope.tamanioListaParts;
          }
        };
        $scope.cargarMenosParts = function(e){
          var ini = $scope.nroPartsMostrados - 2*$scope.nroPartsMostradosPorPagina;
          $scope.nroPartsMostrados -= $scope.nroPartsMostradosPorPagina;
          var fin = $scope.nroPartsMostrados;
          
          
          if (ini<=0)
          {
              $scope.quedanMenosParts = false;
              $scope.quedanMasParts = true;
              $scope.nroPartsMostrados = $scope.nroPartsMostradosPorPagina;
              $scope.listaParts = $scope.participantes.slice(ini, fin);
              $scope.listaParts = $scope.participantes.slice(0, $scope.nroPartsMostrados);
              $scope.nroPaginaActualParts = 1;
          } else
          {
          $scope.listaParts = $scope.participantes.slice(ini, fin);
          $scope.nroPaginaActualParts -= 1;
          }
        
        };
        //
        
         //PARA PAGINACIÓN DE CARRERAS
        $scope.cargarMasCarrs = function(e){
          var ini = $scope.nroCarrsMostrados;
          $scope.nroCarrsMostrados += $scope.nroCarrsMostradosPorPagina;
          var fin = $scope.nroCarrsMostrados;;
          $scope.listaCarrs = $scope.carreras.slice(ini, fin);
          $scope.quedanMenosCarrs = true;
          $scope.nroPaginaActualCarrs += 1;
          if($scope.nroCarrsMostrados >= $scope.tamanioListaCarrs){
              $scope.quedanMasCarrs = false;
              $scope.nroCarrsMostrados = $scope.tamanioListaCarrs;
          }
        };
        $scope.cargarMenosCarrs = function(e){
          var ini = $scope.nroCarrsMostrados - 2*$scope.nroCarrsMostradosPorPagina;
          $scope.nroCarrsMostrados -= $scope.nroCarrsMostradosPorPagina;
          var fin = $scope.nroCarrsMostrados;
          
          
          if (ini<=0)
          {
              $scope.quedanMenosCarrs = false;
              $scope.quedanMasCarrs = true;
              $scope.nroCarrsMostrados = $scope.nroCarrsMostradosPorPagina;
              $scope.listaCarrs = $scope.carreras.slice(ini, fin);
              $scope.listaCarrs = $scope.carreras.slice(0, $scope.nroCarrsMostrados);
              $scope.nroPaginaActualCarrs = 1;
          } else
          {
          $scope.listaCarrs = $scope.carreras.slice(ini, fin);
          $scope.nroPaginaActualCarrs -= 1;
          }
        
        };
        //
        
        
        //PARA PAGINACIÓN DE REQUISITOS
        $scope.cargarMasReqs = function(e){
          var ini = $scope.nroReqsMostrados;
          $scope.nroReqsMostrados += $scope.nroReqsMostradosPorPagina;
          var fin = $scope.nroReqsMostrados;;
          $scope.listaReqs = $scope.requisitos.slice(ini, fin);
          $scope.quedanMenosReqs = true;
          $scope.nroPaginaActualReqs += 1;
          if($scope.nroReqsMostrados >= $scope.tamanioListaReqs){
              $scope.quedanMasReqs = false;
              $scope.nroReqsMostrados = $scope.tamanioListaReqs;
          }
        };
        $scope.cargarMenosReqs = function(e){
          var ini = $scope.nroReqsMostrados - 2*$scope.nroReqsMostradosPorPagina;
          $scope.nroReqsMostrados -= $scope.nroReqsMostradosPorPagina;
          var fin = $scope.nroReqsMostrados;
          
          
          if (ini<=0)
          {
              $scope.quedanMenosReqs = false;
              $scope.quedanMasReqs = true;
              $scope.nroReqsMostrados = $scope.nroReqsMostradosPorPagina;
              $scope.listaReqs = $scope.requisitos.slice(ini, fin);
              $scope.listaReqs = $scope.requisitos.slice(0, $scope.nroReqsMostrados);
              $scope.nroPaginaActualReqs = 1;
          } else
          {
          $scope.listaReqs = $scope.requisitos.slice(ini, fin);
          $scope.nroPaginaActualReqs -= 1;
          }
        
        };
        //
        
          
        

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
            //console.log("ID en controladorProy"+JSON.stringify(id));
            if (isValid) {
                service.AAsociar({"id_proy": JSON.stringify(id), "nombre": ($scope.fAsociar.nombre), "prioridad": ($scope.fAsociar.prioridad)}).then(function(object) {
                });
            }
            $window.location.reload();
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


myApp.controller('Carrera', ['$window', '$scope', '$location', '$routeParams', 'myApp.services', function($window, $scope, $location, $routeParams, service) {
   $scope.nombre = $routeParams._id;
   $scope.numero = $routeParams.numero;
   $scope.ruta='';
   
   
   
   service.Carrera({"_id": $routeParams._id}).then(function(object) {
                
                
                $scope.res = object.data;
                $scope.lista_id_tareas = "";
                $scope.lista_id_responsable="";
                $scope.tareas = [];
                $scope.responsables = [];

                $scope.options = {width: 500, height: 0, 'bar': 'aaa'};
                $scope.totalPeso = 0;
//                $scope.data = [];
                
                
                
//                $scope.data.sort().reverse();
    //            $scope.data = $scope.data1.;
                    $scope.hovered = function(d){
                    $scope.barValue = d;
                    $scope.$apply();
                };
                $scope.barValue = 'None';


                for (var key in object.data) {
                    $scope[key] = object.data[key];
                }
                
                $scope.num_tareas = object.data.carrera['tareas'].length;
                for (var i = 0; i < $scope.num_tareas; i++) {
                    $scope.lista_id_tareas = $scope.lista_id_tareas.concat("{$oid: '");       
                    $scope.lista_id_tareas = $scope.lista_id_tareas.concat(object.data.carrera.tareas[i].$oid);
                    $scope.lista_id_tareas = $scope.lista_id_tareas.concat("'");       
                    if (i !== $scope.num_tareas-1)
                        $scope.lista_id_tareas = $scope.lista_id_tareas.concat("},");
                    else
                        $scope.lista_id_tareas = $scope.lista_id_tareas.concat("}");
                }
                
                //console.log("tareas <- "+ $scope.lista_id);
                service.getObjetosColeccion({"lista_id": $scope.lista_id_tareas, "coleccion": "tarea" }).then(function(object){
                    $scope.tareas = object.data.data;                   
                    
                    var estado = "[{estado: ";
                    var peso = ", peso:";
                    var fin = "}]";
                    $scope.data=[];
                    var i=0;
                    for (var j = 0; j < $scope.num_tareas; j++) {
                        
                        if($scope.tareas[j].estado == "Pendiente"){
                           //$scope.data[i] = estado.concat($scope.tareas[j].estado).concat(peso).concat($scope.tareas[j].peso).concat(fin);
                           $scope.data[i] = $scope.tareas[j];
                           $scope.totalPeso = $scope.totalPeso + $scope.tareas[j].peso;
                           i++;
                        }
                        if($scope.tareas[j].estado == "Atrasada"){
                           //$scope.data[i] = estado.concat($scope.tareas[j].estado).concat(peso).concat($scope.tareas[j].peso).concat(fin);
                           $scope.data[i] = $scope.tareas[j];
                           $scope.totalPeso = $scope.totalPeso + $scope.tareas[j].peso;
                           i++;
                        }
                    }
                    
                    //$scope.data = [{fecha: 2006, peso: 4},{fecha: 2010, peso: 5},{fecha: 2011, peso: 2}];
                    
//                    document.write('Hola: ' + $scope.tareas);
//                    document.write('Hola: ' + $scope.data);
                    
                    
                    for (var i = 0; i < $scope.num_tareas; i++) {
                    $scope.lista_id_responsable = $scope.lista_id_responsable.concat("{$oid: '");       
                    $scope.lista_id_responsable = $scope.lista_id_responsable.concat($scope.tareas[i].responsable.$oid);
                    $scope.lista_id_responsable = $scope.lista_id_responsable.concat("'");       
                    if (i !== $scope.num_tareas-1)
                        $scope.lista_id_responsable = $scope.lista_id_responsable.concat("},");
                    else
                        $scope.lista_id_responsable = $scope.lista_id_responsable.concat("}");
                    }
                    
                    
                    service.getObjetosColeccion({"lista_id": $scope.lista_id_responsable, "coleccion": "participante" }).then(function(object){
                        $scope.responsables = object.data.data;
                        
                    });
                    /*for (var i = 0; i < $scope.num_tareas; i++) {
                        service.getObjetosColeccion({"lista_id":$scope.tareas.responsable, "coleccion": "participante"}).then(function(object){
                            console.log(object.data.data);
                        });
                    }*/
                });
             
            
              
            
            });
       
        $scope.AActualizarEstado = function(id, nuevoEstado) {
            $scope.submitted = true;
            var fecha = "";
            if (nuevoEstado) {
                if (nuevoEstado == "finalizada") {
                    fecha = new Date();
                } 
            
                service.actualizarEstado({"_id": JSON.stringify(id), "estado": nuevoEstado, "fecha":fecha }).then(function(object){                
                });
                $window.location.reload();
            }
            
        };
        
        $scope.AReporte = function (id, tipo) {    
            $location.path('/AReporte/' + id + '/' + tipo);
        };
        
}]);


myApp.controller('AsociarComponente', function($scope, $routeParams) {
    $scope.proyecto = getProyect($routeParams.proyectoId);
});
