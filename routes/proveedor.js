var express = require("express");
var router = express.Router();
const {
    añadirProveedor,
    obtenerProveedores,
    obtenerTodosProveedores,
    eliminarProveedor,
} = require("../database/AdminDAO");

router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send("No has iniciado sesión");
    }

    return next();
});

const esAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).send("No puedes entrar aquí");
    }

    return next();
};

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

router.delete("/", esAdmin, async (req, res) => {
    const resultado = await eliminarProveedor(req.body.idProvider);
    return res.status(resultado.status).send(resultado.mensaje);
});

module.exports = router;
