const LocalStrategy = require("passport-local").Strategy;
const {
    iniciarAdmin,
    iniciarProveedor,
    buscarPorID,
} = require("../database/LoginDAO");

module.exports = passport => {
    const config = {
        usernameField: "usuario",
        passwordField: "contraseña",
        passReqToCallback: true,
    };

    passport.serializeUser(({ _id, role }, done) => done(null, { _id, role }));

    passport.deserializeUser((datos, done) => buscarPorID(datos, done));

    passport.use(
        "iniciarProveedor",
        new LocalStrategy(config, iniciarProveedor)
    );

    passport.use("iniciarAdmin", new LocalStrategy(config, iniciarAdmin));
};
