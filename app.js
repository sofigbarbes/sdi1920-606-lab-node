// Módulos
let express = require('express');
let app = express();

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Variables
app.set('port', 8081);

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

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app); // (app, param1, param2, etc.)

// lanzar el servidor
app.listen(app.get('port'), function () {
    console.log("Servidor activo");
})

