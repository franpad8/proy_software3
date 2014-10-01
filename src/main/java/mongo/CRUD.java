package mongo;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
        MongoClient client = 
                new MongoClient(new ServerAddress(this.databaseServer, 27017));
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

    
}
