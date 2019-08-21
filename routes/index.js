var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
    res.render("index", { title: "Express" });
});

router.get("/hola", (req, res) => {
    return res.send("ya funca");
});

module.exports = router;
