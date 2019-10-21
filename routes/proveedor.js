var express = require("express");
var router = express.Router();
const {
    añadirProveedor,
    obtenerProveedores,
    obtenerTodosProveedores,
    eliminarProveedor,
} = require("../database/AdminDAO");

const {
    actualizarInfoProveedor,
    corregirInfoProveedor,
} = require("../database/ProviderDAO");

const { esAdmin, esProveedor, estaAutentificado } = require("../util/util");

router.use(estaAutentificado);

router.get("/", esAdmin, async (req, res) => {
    const resultado = await obtenerTodosProveedores();
    res.status(resultado.status).send(resultado.mensaje);
});

router.get("/:idProvider", esAdmin, async (req, res) => {
    const resultado = await obtenerProveedores(req.params.idProvider);
    res.status(resultado.status).send(resultado.mensaje);
});

router.post("/", esAdmin, async (req, res) => {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
        return res.status(200).send("Faltan datos");
    }

    const { idAdministrator } = req.user;
    const resultado = await añadirProveedor({
        username,
        password,
        name,
        idAdministrator,
    });

    res.status(resultado.status).send(resultado.mensaje);
});

router.put("/", esProveedor, async (req, res) => {
    const resultado = await actualizarInfoProveedor(
        req.body,
        req.user.idProvider
    );

    return res.status(resultado.status).send(resultado.mensaje);
});

router.patch("/", esProveedor, async (req, res) => {
    const resultado = await corregirInfoProveedor(
        req.body,
        req.user.idProvider
    );

    return res.status(resultado.status).send(resultado.mensaje);
});

router.delete("/:idProvider", esAdmin, async (req, res) => {
    const resultado = await eliminarProveedor(req.params.idProvider);
    return res.status(resultado.status).send(resultado.mensaje);
});

module.exports = router;
