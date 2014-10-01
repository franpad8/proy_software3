var descripcion = "Lorem ipsum dolor sit amet, consectetur adipiscing " +
          "Curabitur tincidunt risus non lacus , consequat consequat era   " +
          "convallis.  Morbi ultricies felis vitae porta sapien rutrum non. " +
          "Aenean scelerisque, orci a scelerisque is, turpis urna tristique " +
          "dui, at euismod nulla massa nec mi. Proin blandit dui quam, eget " +
          "dapibus neque facilisis sed. Phasellus eu mauris id justo cursus " +
          "adipiscing interdum sit amet ligula. Proin a venenatis. Ut non " +
          "hendrerit libero.  Pellentesque ultrices lacus sed bibendum.";
var componentes = [
          "Data Mining",
          "Agile Software Development",
          "SOJO",
          "Netbeans",
        ];

var proyectos = [
  { 
    _id: 0, 
    nombre: "Desarrollo Agil en Venezuela", 
    autor: "Alexis Ibarra",
    descripcion: descripcion,
    componentes: componentes,
  },
  { 
    _id: 1, 
    nombre: "Angular sin morir en el intento", 
    autor: "Alexis Ibarra",
    descripcion: "descripcion",
    componentes: "componentes",
  },
  { 
    id: 2, 
    nombre: "Javascript, el nuevo assembly" ,
    autor: "Alexis Ibarra",
    descripcion: descripcion,
    componentes: componentes,
  },
  { 
    id: 3, 
    nombre: "Perl Monks in Vacations" ,
    autor: "Alexis Ibarra",
    descripcion: descripcion,
    componentes: componentes,
  },
  { 
    id: 4, 
    nombre: "Supervim" ,
    autor: "Alexis Ibarra",
    descripcion: descripcion,
    componentes: componentes,
  },
  { 
    id: 5, 
    nombre: "Haskell what?" ,
    autor: "Alexis Ibarra",
    descripcion: descripcion,
    componentes: componentes,
  },
];

function getAllProyectos(){
	return proyectos;
}

function getProyect($id){
	return proyectos[$id]
}
