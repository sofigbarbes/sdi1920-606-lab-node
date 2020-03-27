module.exports = function (app, swig, gestorBD) {

    app.post('/comentarios/:cancion_id', function (req, res) {
        let comentario = {
            cancion_id: gestorBD.mongo.ObjectID(req.params.cancion_id),
            autor: req.session.usuario,
            texto: req.body.texto
        }
        gestorBD.insertarComentario(comentario, function (id) {
            if (id == null) {
                res.send("Error al insertar comentario");
            } else {
                let respuesta = "añadido";
                res.send(respuesta);
            }
        });

    });

};