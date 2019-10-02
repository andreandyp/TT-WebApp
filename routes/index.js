var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("index.html");
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

module.exports = router;
