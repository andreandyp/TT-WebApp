var express = require("express");
var multer = require("multer");

var router = express.Router();
const { subirLogo } = require("../database/ProviderDAO");

const { esProveedor, estaAutentificado } = require("../util/util");

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

module.exports = router;
