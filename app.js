// Módulos
let express = require('express');
let app = express();
let swig = require('swig');
let mongo = require('mongodb');
let crypto = require('crypto');
let gestorBD = require("./modules/gestorBD.js");
let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));
gestorBD.init(app,mongo);

//routerUsuarioAutor
let routerUsuarioAutor = express.Router();
routerUsuarioAutor.use(function(req, res, next) {
    console.log("routerUsuarioAutor");
    let path = require('path');
    let id = path.basename(req.originalUrl);
// Cuidado porque req.params no funciona
// en el router si los params van en la URL.
    gestorBD.obtenerCanciones(
        {_id: mongo.ObjectID(id) }, function (canciones) {
            console.log(canciones[0]);
            if(canciones[0].autor == req.session.usuario ){
                next();
            } else {
                res.redirect("/tienda");
            }
        })
});
//Aplicar routerUsuarioAutor
app.use("/cancion/modificar",routerUsuarioAutor);
app.use("/cancion/eliminar",routerUsuarioAutor);

// routerUsuarioSession
let routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    console.log("routerUsuarioSession");
    if ( req.session.usuario ) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a : "+req.session.destino)
        res.redirect("/identificarse");
    }
});
//Aplicar routerUsuarioSession
app.use("/canciones/agregar",routerUsuarioSession);
app.use("/publicaciones",routerUsuarioSession);
/*app.use("/audios/",routerUsuarioSession);*/

//routerAudios
let routerAudios = express.Router();
routerAudios.use(function(req, res, next) {
    console.log("routerAudios");
    let path = require('path');
    let idCancion = path.basename(req.originalUrl, '.mp3');
    gestorBD.obtenerCanciones(
        {"_id": mongo.ObjectID(idCancion) }, function (canciones) {
            if(req.session.usuario && canciones[0].autor == req.session.usuario ){
                next();
            } else {
                res.redirect("/tienda");
            }
        })
});
//Aplicar routerAudios
app.use("/audios/",routerAudios);

app.use(express.static('public'));

let fileUpload = require('express-fileupload');
app.use(fileUpload());
let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
// Variables
app.set('db','mongodb://admin:sdi123@tiendamusica-shard-00-00-6wkuj.mongodb.net:27017,tiendamusica-shard-00-01-6wkuj.mongodb.net:27017,tiendamusica-shard-00-02-6wkuj.mongodb.net:27017/test?ssl=true&replicaSet=tiendamusica-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('port', 8081);
app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rautores.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rcomentarios.js")(app, swig, gestorBD); // (app, param1, param2, etc.)

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
