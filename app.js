var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var session = require("express-session");
var html = require("ejs").renderFile;

require("dotenv").config();
require("./config/passport-init")(passport);
require("./config/firebase").conectar();

var authRouter = require("./routes/auth")(passport);
var providerRouter = require("./routes/proveedor");
var modelRouter = require("./routes/modelos");
var viewsRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var paintRouter = require("./routes/pinturas");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");
app.engine("html", html);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        cookie: { maxAge: 1000 * 60 * 60 }, //1 día
        saveUninitialized: false,
        resave: false,
        secret: "secret",
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewsRouter);
app.use("/auth", authRouter);
app.use("/proveedor", providerRouter);
app.use("/modelos", modelRouter);
app.use("/api", apiRouter);
app.use("/pinturas", paintRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
