var express = require("express");
var multer = require("multer");

var router = express.Router();
var upload = multer({ storage: multer.memoryStorage() });

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

router.post(
    "/",
    upload.fields([
        { name: "modelo3d", maxCount: 1 },
        { name: "modelo2d", maxCount: 1 },
    ]),
    async (req, res) => {
        const { modelo3d, modelo2d } = req.files;
        if (req.body.category !== "PISOS" && !modelo3d) {
            return res.status(400).send("Falta el modelo en 3D");
        }

        if (!modelo2d) {
            return res.status(400).send("Falta la imagen del modelo");
        }

        const resultado = await añadirModelo({
            datosModelo: req.body,
            idProvider: req.user.idProvider,
            modelo3d: modelo3d ? modelo3d[0] : "",
            modelo2d: modelo2d[0],
        });

        res.status(resultado.status).send(resultado.mensaje);
    }
);

router.delete("/:idModel", async (req, res) => {
    const resultado = await eliminarModelo(
        req.params.idModel,
        req.user.idProvider
    );
    return res.status(resultado.status).send(resultado.mensaje);
});

module.exports = router;
