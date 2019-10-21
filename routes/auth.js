const express = require("express");
const router = express.Router();

module.exports = passport => {
    router.post("/loginAdmin", (req, res) => {
        if (!req.body.usuario || !req.body.contraseña) {
            return res.status(400).send("Faltan datos");
        }

        passport.authenticate("iniciarAdmin", (error, usuario) => {
            if (error) {
                return res
                    .status(error.status || 500)
                    .send(error.mensaje || error);
            }

            req.logIn(usuario, () => res.json(usuario));
        })(req, res);
    });

    router.post("/loginProvider", (req, res) => {
        if (!req.body.usuario || !req.body.contraseña) {
            return res.status(400).send("Faltan datos");
        }
        passport.authenticate("iniciarProveedor", (error, usuario) => {
            if (error) {
                return res
                    .status(error.status || 500)
                    .send(error.mensaje || error);
            }

            req.logIn(usuario, () => res.json(usuario));
        })(req, res);
    });

    router.get("/salir", (req, res) => {
        req.logout();
        req.session.destroy();
        res.end();
    });

    router.get("/activo", (req, res) => {
        if (req.user) {
            res.send(req.user);
        } else {
            res.sendStatus(401);
        }
    });

    return router;
};
