package proyectos.proyectos;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import com.mongodb.util.JSON;
import freemarker.template.Configuration;
import java.io.Console;
import java.io.IOException;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;
import mongo.CRUD;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;

public class ProyectosService {

    private static final Logger logger = LoggerFactory.getLogger("logger");

    public static void main(String[] args) throws UnknownHostException {
        final Configuration configuration = new Configuration();
        configuration.setClassForTemplateLoading(
                ProyectosService.class, "/");

        MongoClient client = new MongoClient(new ServerAddress("localhost", 27017));

        final DB database = client.getDB("test");
        
        Spark.get(new Route("/proyecto/obtenerParticipante"){
            @Override
            public Object handle(final Request request,
                    final Response response){
                String res = "{}";
                res = "{\"data\": ";
                try{
                  
                    ObjectId crit = (ObjectId)JSON.parse(request.queryParams("_id"));
                    CRUD crud = new CRUD("test", "localhost");
                    final DBObject mensaje = crud.findById("participante", crit);
                    res += mensaje.toString();
                    res +=  "}";
                
                } catch(IOException e) {
                    e.printStackTrace();
                    
                }
                
                return res;
            }
    
        });


        Spark.get(new Route("/proyectos/listar") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                String res = "{}";
                //Action code goes here, change res accordingly
                res = "{\"data\": [";
                ObjectId crit = (ObjectId)JSON.parse(request.queryParams("_id"));
                try {
                    CRUD crud = new CRUD("test", "localhost");
                    for(DBObject row:crud.list("proyectos")) {
                        res += row.toString() + ", ";
                    }
                    res = res.substring(0,res.length()-2) + "]}";
                } catch (IOException e) {
                   e.printStackTrace();
                }

                //Action code ends here
                return res;
            }
        });

        Spark.get(new Route("/proyecto/ABorrar") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                String[] labels = {
                  "/ListarProyectos", };
                String res = labels[0];
                //Action code goes here, change res accordingly
                try {
                    ObjectId crit = (ObjectId)JSON.parse(request.queryParams("_id"));
                    CRUD crud = new CRUD("test", "localhost");
                    crud.removeObject("proyectos", 
                            new BasicDBObject("_id", crit));
                    

                } catch (IOException e) {
                   e.printStackTrace();
                }

                //Action code ends here
                return res;
            }
        });
        
        Spark.get(new Route("/proyecto/AModificar") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                String[] labels = {
                  "/ModificarProyecto", };
                String res = labels[0];
                //Action code goes here, change res accordingly
                res+="/"+request.queryParams("_id");
                //Action code ends here
                return res;
            }
        });
        
        Spark.get(new Route("/proyecto/Modificar") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                String res = "{}";
                //Action code goes here, change res accordingly
                try {
                    ObjectId crit = (ObjectId)JSON.parse(request.queryParams("_id"));
                    res = "{\"proyecto\": ";
                    CRUD crud = new CRUD("test", "localhost");
                    final DBObject mensaje = crud.findById("proyectos", crit); 
                    res += mensaje.toString() 
                            + ", \"_id\": { \"$oid\" : \"" + mensaje.get("_id").toString()
                            + "\"}}";
                } catch (Throwable e) {
                   e.printStackTrace();
                }

                //Action code ends here
                return res;
            }
        }); 
        
        Spark.get(new Route("/proyecto/AAsociar") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                String res = "{}";
                //Action code goes here, change res accordingly
                try {
                    //ObjectId crit = (ObjectId)JSON.parse(request.queryParams("nombre"));
                    res = "{\"proyecto\": ";
                    CRUD crud = new CRUD("test", "localhost");
                    crud.insertCollection("proyectos", request.queryParams("nombre"), request.queryParams("requisito"),request.queryParams("prioridad")); 

                    /*res += mensaje.toString() 
                            + ", \"_id\": { \"$oid\" : \"" + mensaje.get("_id").toString()
                            + "\"}}";*/
                } catch (Throwable e) {
                   e.printStackTrace();
                }

                //Action code ends here
                return res;
            }
        });
       
        
        Spark.get(new Route("/proyecto/AProyecto") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                String[] labels = {
                  "/VerProyecto", };
                String res = labels[0];
                //Action code goes here, change res accordingly
                res+="/"+request.queryParams("_id");
                //Action code ends here
                return res;
            }
        });


        Spark.get(new Route("/proyecto/Proyecto") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                String res = "{}";
                //Action code goes here, change res accordingly
                try {
                    ObjectId crit = (ObjectId)JSON.parse(request.queryParams("_id"));
                    res = "{\"proyecto\": ";
                    CRUD crud = new CRUD("test", "localhost");
                    final DBObject mensaje = crud.findById("proyectos", crit); 
                    res += mensaje.toString() 
                            + ", \"_id\": { \"$oid\" : \"" + mensaje.get("_id").toString()
                            + "\"}}";
                } catch (Throwable e) {
                   e.printStackTrace();
                }


                //Action code ends here
                return res;
            }
        });

        Spark.get(new Route("/proyecto/Crear") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                String res = "{}";
                //Action code goes here, change res accordingly
                //Action code ends here
                return res;
            }
        });



        Spark.get(new Route("/proyecto/APreCrear") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                String[] labels = {
                  "/Crear", };
                String res = labels[0];
                //Action code goes here, change res accordingly
                //Action code ends here
                return res;
            }            
            
        });


        Spark.post(new Route("/proyecto/ACrear") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                final Map<String,String> params = new HashMap<String, String>();
                if(request.contentType()
                 .equals("application/x-www-form-urlencoded; charset=UTF-8")) {
                    URLEncodedUtils.parse(request.body(), 
                            Charset.forName("UTF-8"))
                            .forEach(new Consumer<NameValuePair>() {
                        public void accept(NameValuePair pair) {
                            params.put(pair.getName(), pair.getValue());
                        }
                    });
                }        String[] labels = {
                  "/ListarProyectos", "/Crear", };
                String res = labels[0];
                //Action code goes here, change res accordingly
                String nombre = params.get("nombre");
                String participantes = params.get("participantes");
                String descripcion = params.get("descripcion");
                try {
                    CRUD crud = new CRUD("test", "localhost");
                    DBObject value = new BasicDBObject("nombre", nombre)
                            .append("participantes", participantes)
                            .append("descripcion", descripcion);
                    crud.insertObject("proyectos", value);
                } catch (IOException e) {
                   e.printStackTrace();
                }

                //Action code ends here
                return res;
            }
        });
        
        
        
        Spark.post(new Route("/proyecto/AModif") {
            @Override
            public Object handle(final Request request,
                    final Response response) {
                final Map<String,String> params = new HashMap<String, String>();
                if(request.contentType()
                 .equals("application/x-www-form-urlencoded; charset=UTF-8")) {
                    URLEncodedUtils.parse(request.body(), 
                            Charset.forName("UTF-8"))
                            .forEach(new Consumer<NameValuePair>() {
                        public void accept(NameValuePair pair) {
                            params.put(pair.getName(), pair.getValue());
                        }
                    });
                }        String[] labels = {
                  "/ListarProyectos"};
                String res = labels[0];
                //Action code goes here, change res accordingly
                ObjectId crit = (ObjectId)JSON.parse(request.queryParams("_id"));   
                String nombre = params.get("nombre");
                String participantes = params.get("participantes");
                String descripcion = params.get("descripcion");
                try {
                    CRUD crud = new CRUD("test", "localhost");
                    DBObject value = new BasicDBObject("_id",crit)
                            .append("nombre", nombre)
                            .append("participantes", participantes)
                            .append("descripcion", descripcion);
                    crud.updateObject("proyectos", value);
                } catch (IOException e) {
                   e.printStackTrace();
                }

                //Action code ends here
                return res;
            }
        });                        
        
        

    }
}