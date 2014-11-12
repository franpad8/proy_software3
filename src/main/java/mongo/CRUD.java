package mongo;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import com.mongodb.util.JSON;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.bson.types.ObjectId;

public class CRUD {

    protected String databaseName;
    protected String databaseServer;
    protected DB database;

    public CRUD() throws IOException {
        this("test", "localhost");
    }

    public CRUD(String databaseName, String databaseServer) throws IOException {
        this.databaseName = databaseName;
        this.databaseServer = databaseServer;
        MongoClient client
                = new MongoClient(new ServerAddress(this.databaseServer, 27017));
        database = client.getDB(databaseName);

    }

    public List<DBObject> list(String collection) {
        DBCollection coll = database.getCollection(collection);
        DBCursor cursor = coll.find();
        return new ArrayList<DBObject>(cursor.toArray());
    }

    public DBObject findById(String collection, String id) {
        DBCollection coll = database.getCollection(collection);
        DBObject crit = new BasicDBObject("_id", id);
        return coll.findOne(crit);
    }

    public DBObject findById(String collection, Object id) {
        DBCollection coll = database.getCollection(collection);
        DBObject crit = new BasicDBObject("_id", id);
        return coll.findOne(crit);
    }
    
    public DBObject findByEmail(String email) {
        DBCollection coll = database.getCollection("participante");
        DBObject crit = new BasicDBObject("email", email);
        return coll.findOne(crit);
    }

    public void updateObject(String collection, DBObject value) {
        DBCollection coll = database.getCollection(collection);
        coll.save(value);
    }

    public void insertObject(String collection, DBObject value) {
        DBCollection coll = database.getCollection(collection);
        coll.insert(value);
    }

    public void removeObject(String collection, DBObject value) {
        DBCollection coll = database.getCollection(collection);
        coll.remove(value);
    }

    public String getDatabaseName() {
        return databaseName;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }

    public String getDatabaseServer() {
        return databaseServer;
    }

    public void setDatabaseServer(String databaseServer) {
        this.databaseServer = databaseServer;
    }

    public DB getDatabase() {
        return database;
    }

    public void setDatabase(DB database) {
        this.database = database;
    }

    public void insertCollectionTarea(String collection, String id_tarea, String estado, String fecha) {
        //Esta es la coleccion proyectos
        //nombre=capitalize(nombre);
        DBCollection collTar = database.getCollection(collection);
        //DBCollection collProy = database.getCollection("proyecto");
        BasicDBObject newDocument = new BasicDBObject();
    	newDocument.append("$set", new BasicDBObject().append("estado", estado));
        ObjectId id_tarea1 = (ObjectId) JSON.parse(id_tarea);
        BasicDBObject searchQuery = new BasicDBObject().append("_id", id_tarea1);
        collTar.update(searchQuery, newDocument);
        if (estado.equals("Completada")){
            BasicDBObject newDocument_aux = new BasicDBObject();
            newDocument_aux.append("$set", new BasicDBObject().append("fechaFin", fecha));
            collTar.update(searchQuery, newDocument_aux);
        }
    }

    
    public void insertCollectionReq(String collection, String id_proy, String nombre, String prioridad) {
        //Esta es la coleccion proyectos
        nombre=capitalize(nombre);
        
        DBCollection collReq = database.getCollection(collection);
        DBCollection collProy = database.getCollection("proyecto");
        
        BasicDBObject elemento = new BasicDBObject().append("nombre", nombre).append("prioridad", prioridad);
        BasicDBObject AUX = new BasicDBObject();
        AUX.append("$set", elemento);
        BasicDBObject searchQuery = new BasicDBObject().append("nombre", nombre);
        collReq.update(searchQuery, AUX, true, false);

        
        BasicDBObject condicion = new BasicDBObject().append("_id", 1);
        BasicDBObject reqInsertado = (BasicDBObject) collReq.findOne(elemento,condicion);

        
        ObjectId id_proyecto = (ObjectId) JSON.parse(id_proy);
        BasicDBObject newDocument = new BasicDBObject();
        newDocument.append("$addToSet", new BasicDBObject("requisitos", reqInsertado));


        searchQuery = new BasicDBObject().append("_id", id_proyecto);
                
        collProy.update(searchQuery, newDocument);
    }

    public void insertCollectionCeremonia(String collection, String id, String usuario, String tipo, String reporte, String fecha) {
        //Esta es la coleccion proyectos
        DBCollection coll = database.getCollection(collection);
        //proyecto a modificar
        BasicDBObject elemento = new BasicDBObject().append("tipo", tipo).append("usuario", usuario).append("reporte", reporte).append("fecha", fecha);

        BasicDBObject newDocument = new BasicDBObject();
        newDocument.append("$addToSet", new BasicDBObject("ceremonias", elemento));
        System.out.println(elemento.toString());
        System.out.println(newDocument.toString());
//        newDocument.append("$addToSet", newDocument.append("prioridad", prioridad));
        ObjectId crit = (ObjectId) JSON.parse(id);
        BasicDBObject searchQuery = new BasicDBObject().append("_id", crit);
        coll.update(searchQuery, newDocument);
    }

    private static String capitalize(String s) {
        if (s.length() == 0) {
            return s;
        }
        char first = s.charAt(0);
        char capitalized = Character.toUpperCase(first);
        return (first == capitalized) ? s : capitalized + s.substring(1);
    }

}
