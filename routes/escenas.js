var express = require("express");

var router = express.Router();

const {
    obtenerEscenas,
    obtenerEscena,
    añadirEscena,
    modificarEscena,
    eliminarEscena,
} = require("../database/ARSceneDAO");

router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send("No has iniciado sesión");
    }

    if (req.user.role !== "provider") {
        return res.status(401).send("No puedes entrar aquí");
    }

    return next();
});

router.get("/", async (req, res) => {
    const resultado = await obtenerEscenas(req.user.idProvider);
    res.status(resultado.status).send(resultado.mensaje);
});

router.get("/:idARScene", async (req, res) => {
    const resultado = await obtenerEscena(
        req.params.idARScene,
        req.user.idProvider
    );
    res.status(resultado.status).send(resultado.mensaje);
});

router.post("/", async (req, res) => {
    const resultado = await añadirEscena({
        datosPintura: req.body,
        idProvider: req.user.idProvider,
    });

    res.status(resultado.status).send(resultado.mensaje);
});

router.put("/", async (req, res) => {
    const resultado = await modificarEscena({
        datosPintura: req.body,
        idProvider: req.user.idProvider,
    });

    res.status(resultado.status).send(resultado.mensaje);
});

router.delete("/:idARScene", async (req, res) => {
    const resultado = await eliminarEscena(
        req.params.idARScene,
        req.user.idProvider
    );
    return res.status(resultado.status).send(resultado.mensaje);
});

module.exports = router;
