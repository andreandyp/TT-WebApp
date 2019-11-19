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

router.get("/misproveedores", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "admin") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("misproveedores.html");
});

router.get("/formadministrador", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "admin") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("formadministrador.html");
});

router.get("/formproveedor", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    res.render("formproveedor.html");
});

router.get("/formmueble", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "provider") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("formmueble.html");
});

router.get("/formpintura", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "provider") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("formpintura.html");
});

router.get("/misescenas", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "provider") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("misescenas.html");
});

router.get("/visualizarmodelos", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "provider") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("visualizarmodelos.html");
});

router.get("/corregirmueble/:id", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "provider") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("corregirmueble.html");
});

router.get("/visualizarinfoproveedor", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "provider") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("visualizarinfoproveedor.html");
});

router.get("/visualizarpinturas", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    if (req.user.role !== "provider") {
        return res.status(401).send("No puedes entrar aquí");
    }

    res.render("visualizarpinturas.html");
});

router.get("/", (req, res) => {
    res.render("index.html");
});

module.exports = router;
