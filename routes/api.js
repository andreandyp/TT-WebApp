var express = require("express");
var router = express.Router();
const {
    obtenerModelos,
    obtenerProveedores,
    obtenerDatos,
    obtenerPinturas,
    obtenerEscenas,
} = require("../database/ApiDAO");

router.get("/v1.0/models", async (req, res) => {
    const resultado = await obtenerModelos();
    res.status(resultado.status).send(resultado.mensaje);
});

router.get("/v1.0/providers", async (req, res) => {
    const resultado = await obtenerProveedores();
    res.status(resultado.status).send(resultado.mensaje);
});

router.get("/v1.0/data", async (req, res) => {
    const resultado = await obtenerDatos();
    res.status(resultado.status).send(resultado.mensaje);
});

router.get("/v1.0/paints", async (req, res) => {
    const resultado = await obtenerPinturas();
    res.status(resultado.status).send(resultado.mensaje);
});

router.get("/v1.0/scenes", async (req, res) => {
    const resultado = await obtenerEscenas();
    res.status(resultado.status).send(resultado.mensaje);
});

module.exports = router;
