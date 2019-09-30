const bcrypt = require("bcrypt-nodejs");
const { Op } = require("sequelize");

const { Administrator, Provider } = require("../config/db");

async function iniciarAdmin(req, usuario, contraseña, done) {
    try {
        const [admin] = await Administrator.findAll({
            attributes: ["idAdministrator", "username", "password"],
            where: {
                username: {
                    [Op.iRegexp]: `^${usuario}$`,
                },
            },
            raw: true,
        });

        if (!admin) {
            return done(
                {
                    status: 404,
                    mensaje: "El usuario no existe",
                },
                false
            );
        }

        if (!validarClave(contraseña, admin.password)) {
            return done(
                {
                    status: 400,
                    mensaje: "Contraseña incorrecta",
                },
                false
            );
        }

        const { idAdministrator: _id, username } = admin;

        done(null, { _id, username, role: "admin" });
    } catch (error) {
        done(error, false);
    }
}

async function iniciarProveedor(req, usuario, contraseña, done) {
    try {
        const [provider] = await Provider.findAll({
            attributes: ["idProvider", "username", "password"],
            where: {
                username: {
                    [Op.iRegexp]: `^${usuario}$`,
                },
            },
            raw: true,
        });

        if (!provider) {
            return done(
                {
                    status: 404,
                    mensaje: "El usuario no existe",
                },
                false
            );
        }

        if (!validarClave(contraseña, provider.password)) {
            return done(
                {
                    status: 400,
                    mensaje: "Contraseña incorrecta",
                },
                false
            );
        }

        const { idProvider: _id, username } = provider;

        done(null, { _id, username, role: "provider" });
    } catch (error) {
        done(error, false);
    }
}

async function buscarPorID(datos, done) {
    try {
        if (datos.role === "provider") {
            const [resultados] = await Provider.findAll({
                attributes: ["idProvider", "username", "name"],
                where: {
                    idProvider: datos._id,
                },
                raw: true,
            });

            return done(null, { ...resultados, role: datos.role });
        }

        const [resultados] = await Administrator.findAll({
            attributes: ["idAdministrator", "username"],
            where: {
                idAdministrator: datos._id,
            },
            raw: true,
        });

        return done(null, { ...resultados, role: datos.role });
    } catch (error) {
        return done(error, null);
    }
}

function validarClave(contraseña, hash) {
    return bcrypt.compareSync(contraseña, hash);
}

module.exports = {
    iniciarAdmin,
    iniciarProveedor,
    buscarPorID,
};
