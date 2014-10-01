package proyectos;

import java.net.UnknownHostException;
import spark.Spark;
import proyectos.proyectos.ProyectosService;


public class Base {

    public static void main(String[] args) throws UnknownHostException {
        Spark.staticFileLocation("public");
        ProyectosService.main(args);

    }
}