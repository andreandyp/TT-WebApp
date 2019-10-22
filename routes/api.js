var express = require("express");
var router = express.Router();
const { obtenerModelos, obtenerProveedores } = require("../database/ApiDAO");

router.get("/v1.0/models", async (req, res) => {
    const resultado = await obtenerModelos();
    res.status(resultado.status).send(resultado.mensaje);
});

router.get("/v1.0/providers", async (req, res) => {
    const resultado = await obtenerProveedores();
    res.status(resultado.status).send(resultado.mensaje);
});

module.exports = router;
