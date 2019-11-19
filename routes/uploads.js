var express = require("express");
var multer = require("multer");

var router = express.Router();
const { subirLogo } = require("../database/ProviderDAO");
const { subirImagenEscena } = require("../database/ARSceneDAO");

var upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/logo",
    upload.fields([{ name: "logo", maxCount: 1 }]),
    async (req, res) => {
        if (req.user.role !== "provider") {
            return res.status(401).send("No puedes entrar aquí");
        }
        if (!req.isAuthenticated()) {
            return res.status(401).send("No has iniciado sesión");
        }

        const { logo } = req.files;
        if (!logo) {
            return res.status(400).send("Falta tu logo");
        }
        const resultado = await subirLogo(logo[0], req.user.idProvider);

        return res.status(resultado.status).send(resultado.mensaje);
    }
);

router.post(
    "/imagen-escena",
    upload.fields([{ name: "imagen", maxCount: 1 }]),
    async (req, res) => {
        if (req.user.role !== "provider") {
            return res.status(401).send("No puedes entrar aquí");
        }
        if (!req.isAuthenticated()) {
            return res.status(401).send("No has iniciado sesión");
        }

        const { idARScene } = req.body;

        if (!idARScene) {
            return res.status(401).send("Falta el id de la escena");
        }

        const { imagen } = req.files;
        if (!imagen) {
            return res.status(400).send("Falta la imagen");
        }
        const resultado = await subirImagenEscena(
            imagen[0],
            req.user.idProvider,
            idARScene
        );

        return res.status(resultado.status).send(resultado.mensaje);
    }
);

module.exports = router;
