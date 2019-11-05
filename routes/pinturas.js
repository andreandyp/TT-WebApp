var express = require("express");

var router = express.Router();

const {
    obtenerPinturas,
    obtenerPintura,
    añadirPintura,
    modificarPintura,
    eliminarPintura,
} = require("../database/PaintDAO");

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
    const resultado = await obtenerPinturas(req.user.idProvider);
    res.status(resultado.status).send(resultado.mensaje);
});

router.get("/:idPaint", async (req, res) => {
    const resultado = await obtenerPintura(
        req.params.idPaint,
        req.user.idProvider
    );
    res.status(resultado.status).send(resultado.mensaje);
});

router.post("/", async (req, res) => {
    const resultado = await añadirPintura({
        datosPintura: req.body,
        idProvider: req.user.idProvider,
    });

    res.status(resultado.status).send(resultado.mensaje);
});

router.put("/", async (req, res) => {
    const resultado = await modificarPintura({
        datosPintura: req.body,
        idProvider: req.user.idProvider,
    });

    res.status(resultado.status).send(resultado.mensaje);
});

router.delete("/:idPaint", async (req, res) => {
    const resultado = await eliminarPintura(
        req.params.idPaint,
        req.user.idProvider
    );
    return res.status(resultado.status).send(resultado.mensaje);
});

module.exports = router;
