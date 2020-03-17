module.exports = function (app) {
    app.get("/canciones", function (req, res) {
        res.send("ver canciones");
    });


    app.get("/canciones/:id", function (req, res) {
        let respuesta = 'id: ' + req.params.id;
        res.send(respuesta);
    });

    app.get("/canciones/:genero/:id", function (req, res) {
        let respuesta = 'id: ' + req.params.id + '<br>'
            + 'Género: ' + req.params.genero;
        res.send(respuesta);
    });

    app.post('/cancion', function (req, res) {
        let respuesta = "Canción agregada: " + req.body.nombre + '<br>'
            + 'Género: ' + req.body.genero + '<br>' +"Precio: " + req.body.precio;
        res.send(respuesta);
    });
    app.get('/promo*', function (req, res) {
        res.send('Respuesta patrón promo* ');
    })


};
