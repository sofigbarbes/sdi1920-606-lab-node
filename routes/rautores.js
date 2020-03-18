module.exports = function (app, swig) {
    /*
    app.get("/canciones", function (req, res) {
        res.send("ver canciones");
    });
*/
    /*
    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/bautores-agregar.html', {});
        res.send(respuesta);
    })
*/
    app.post('/autor', function (req, res) {
        let respuesta = "Autor agregado: " + req.body.nombre + '<br>'
            + 'Grupo: ' + req.body.grupo + '<br>' + "Rol: " + req.body.rol;

        respuesta = "";
        if (req.body.nombre === "") {
            respuesta += 'Nombre no enviado en la petición' + '<br>';
        } else {
            respuesta += "Nombre: " + req.body.nombre + '<br>';
        }
        if (req.body.grupo === "") {
            respuesta += 'Grupo no enviado en la petición' + '<br>';
        } else {
            respuesta += "Grupo: " + req.body.grupo + '<br>';
        }
        respuesta += "Rol: " + req.body.rol + '<br>';
        res.send(respuesta);
    });

    app.get("/autores", function (req, res) {
        let autores = [{
            "nombre": "Paquito",
            "grupo": "Grupo1",
            "rol": "Bajista",
        }, {
            "nombre": "Juana",
            "Grupo": "Otro grupo",
            "rol": "Guitarrista",

        }, {
            "nombre": "Marta",
            "Grupo": "Otro",
            "rol": "Cantante",
        }
        ];
        let respuesta = swig.renderFile("views/autores.html", {
            vendedor: "Autores",
            autores: autores
        });
        res.send(respuesta);
    });


    app.get('/autores/agregar', function (req, res) {
        let roles = [{"nombre": "Cantante"},
            {"nombre": "Batería"},
            {"nombre": "Bajista"},
            {"nombre": "Teclista"},
            {"nombre": "Guitarrista"}];

        let respuesta = swig.renderFile('views/autores-agregar.html', {
            roles: roles
        });
        res.send(respuesta);
    });


    app.get('/autores/*', function (req, res) {
        res.redirect("/autores");
    })


};