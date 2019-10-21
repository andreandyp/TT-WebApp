var express = require("express");
var router = express.Router();

router.get("/inicio_admin", (req, res) => {
    res.render("inicio_admin.html");
});

router.get("/inicio_proveedor", (req, res) => {
    res.render("inicio_proveedor.html");
});

router.get("/proveedores", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "admin") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("proveedores.html");
});

router.get("/formadministrador", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    res.render("formadministrador.html");
});

router.get("/formproveedor", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    res.render("formproveedor.html");
});

router.get("/", (req, res) => {
    res.render("index.html");
});

module.exports = router;
