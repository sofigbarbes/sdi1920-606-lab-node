// Módulos
let express = require('express');
let app = express();
let swig = require('swig');
let mongo = require('mongodb');

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.set('db','mongodb://admin:sdi123@tiendamusica-shard-00-00-6wkuj.mongodb.net:27017,tiendamusica-shard-00-01-6wkuj.mongodb.net:27017,tiendamusica-shard-00-02-6wkuj.mongodb.net:27017/test?ssl=true&replicaSet=tiendamusica-shard-0&authSource=admin&retryWrites=true&w=majority');

// Variables
app.set('port', 8081);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig, mongo); // (app, param1, param2, etc.)
require("./routes/rautores.js")(app, swig); // (app, param1, param2, etc.)

// lanzar el servidor
app.listen(app.get('port'), function () {
    console.log("Servidor activo");
})


/*
app.get("/canciones", function (req, res) { //obtener los parametros enviados en una peticion get
    // si quisieramos pasar de parametros unos enteros, se concatenarian, asi que tenemos que hacer
    // parseInt(req.query.num1)
    // res.send(String(respuesta))
    let respuesta = "";
    if (req.query.nombre != null)
        respuesta += 'Nombre: ' + req.query.nombre + '<br>';
    if (typeof (req.query.autor) != "undefined")
        respuesta += 'Autor: ' + req.query.autor;
    res.send(respuesta);
});
*/
