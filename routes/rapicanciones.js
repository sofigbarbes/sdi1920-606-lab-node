module.exports = function (app, gestorBD) {

    app.get("/api/cancion", function (req, res) {
        gestorBD.obtenerCanciones({}, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });

    app.get("/api/cancion/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio, function (canciones) {

            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones[0]));
            }

        });
    });

    app.delete("/api/cancion/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio, function (canciones) {
            let autor = canciones[0].autor; //
            var puedeEliminar = false;
            if (autor === res.usuario) {
                puedeEliminar = true;
            }
            if (puedeEliminar) {
                gestorBD.eliminarCancion(criterio, function (canciones) {
                    if (canciones == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.send(JSON.stringify(canciones));

                    }
                });
            } else {
                res.status(500);
                res.json({
                    error: "No eres el propietario de la canción."
                })
            }
        });

    });


    app.post("/api/cancion", function (req, res) {

        var cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
            autor: res.usuario
        }

        errorMessage = "";

        let hasInvalidInputs = false;

        if (req.body.nombre == null || req.body.nombre.length < 3) {
            hasInvalidInputs = true;
            errorMessage = "Name must be >3 characters"
        }
        if (req.body.genero == null) {
            hasInvalidInputs = true;
            errorMessage = "Genero no puede ser nulo"
        }
        if (req.body.precio == null || req.body.precio <= 0) {
            hasInvalidInputs = true;
            errorMessage = "Price must be positive >0"
        }
        if (!hasInvalidInputs) {
            gestorBD.insertarCancion(cancion, function (id) {
                if (id == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje: "canción insertarda",
                        _id: id
                    })
                }
            });
        } else {
            res.status(500);
            res.json({
                error: errorMessage
            })
        }
    });


    app.put("/api/cancion/:id", function (req, res) {

            let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

            let cancion = {}; // Solo los atributos a modificar

            let hasInvalidInputs = false;
            errorMessage = "";

            if (req.body.nombre == null || req.body.nombre.length < 3) {
                hasInvalidInputs = true;
                errorMessage = "Name must be >3 characters"
            }
            if (req.body.genero == null) {
                hasInvalidInputs = true;
                errorMessage = "Genero no puede ser nulo"
            }
            if (req.body.precio == null || req.body.precio <= 0) {
                hasInvalidInputs = true;
                errorMessage = "Price must be positive >0"
            }
            if (!hasInvalidInputs) {
                var puedeModificar = false;
                if (req.body.autor === res.usuario) {
                    puedeModificar = true;
                }
                if (puedeModificar) {
                    gestorBD.modificarCancion(criterio, cancion, function (result) {
                        if (result == null || hasError) {
                            res.status(500);
                            res.json({
                                error: "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.json({
                                mensaje: "canción modificada",
                                _id: req.params.id
                            })
                        }
                    });
                } else {
                    res.status(500);
                    res.json({
                        error: "No eres el propietario de la canción."
                    })
                }
            } else {
                res.status(500);
                res.json({
                    error: errorMessage
                })
            }

        }
    );

    app.post("/api/autenticar/", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401); //Sin autorización
                res.json({
                    autenticado: false
                })
            } else {
                var token = app.get('jwt').sign(
                    {usuario: criterio.email, tiempo: Date.now() / 1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                });
            }
        });
    });

}