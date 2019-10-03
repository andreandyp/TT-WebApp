var express = require("express");
var router = express.Router();
const {
    obtenerModelo,
    obtenerModelos,
    añadirModelo,
    eliminarModelo,
} = require("../database/ModelDAO");

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
    const resultado = await obtenerModelos(req.user.idProvider);
    res.status(resultado.status).send(resultado.mensaje);
});

router.get("/:idModel", async (req, res) => {
    const resultado = await obtenerModelo(
        req.params.idModel,
        req.user.idProvider
    );
    res.status(resultado.status).send(resultado.mensaje);
});

router.post("/", async (req, res) => {
    const resultado = await añadirModelo(req.body, req.user.idProvider);

    res.status(resultado.status).send(resultado.mensaje);
});

router.delete("/:idModel", async (req, res) => {
    const resultado = await eliminarModelo(
        req.params.idModel,
        req.user.idProvider
    );
    return res.status(resultado.status).send(resultado.mensaje);
});

module.exports = router;
