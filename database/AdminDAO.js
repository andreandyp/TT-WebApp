const bcrypt = require("bcrypt-nodejs");

const { Provider } = require("../config/db");

async function obtenerTodosProveedores() {
    try {
        const proveedores = await Provider.findAll({
            attributes: [
                "idProvider",
                "username",
                "name",
                "phone",
                "email",
                "Administrator_idAdministrator",
            ],
            raw: true,
        });

        return { status: 200, mensaje: proveedores };
    } catch (error) {
        return { status: 500, mensaje: error };
    }
}

async function obtenerProveedores(idAdministrator) {
    try {
        const proveedores = await Provider.findAll({
            attributes: [
                "idProvider",
                "username",
                "name",
                "phone",
                "email",
                "Administrator_idAdministrator",
            ],
            where: {
                Administrator_idAdministrator: idAdministrator,
            },
            raw: true,
        });

        return { status: 200, mensaje: proveedores };
    } catch (error) {
        return { status: 500, mensaje: error };
    }
}

async function añadirProveedor({ username, password, name, idAdministrator }) {
    try {
        const [proveedor] = await Provider.findAll({
            attributes: ["username"],
            where: {
                username,
            },
            raw: true,
        });

        if (proveedor) {
            return { status: 400, mensaje: "El proveedor ya existe" };
        }

        const { idProvider } = await Provider.create({
            username,
            password: crearHash(password),
            name,
            Administrator_idAdministrator: idAdministrator,
        });

        return {
            status: 200,
            mensaje: {
                username,
                name,
                Administrator_idAdministrator: idAdministrator,
                idProvider,
            },
        };
    } catch (error) {
        return { status: 500, mensaje: error };
    }
}

async function eliminarProveedor(idProvider) {
    try {
        await Provider.destroy({
            where: {
                idProvider,
            },
        });

        return { status: 200, mensaje: "Proveedor eliminado" };
    } catch (error) {
        return { status: 500, mensaje: error };
    }
}

function crearHash(contraseña) {
    return bcrypt.hashSync(contraseña, bcrypt.genSaltSync(10), null);
}

module.exports = {
    añadirProveedor,
    obtenerProveedores,
    obtenerTodosProveedores,
    eliminarProveedor,
};
