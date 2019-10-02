const { Model, Color } = require("../config/db");

async function obtenerModelo() {
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

async function obtenerModelos(idAdministrator) {
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

async function añadirModelo({ username, password, name, idAdministrator }) {
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

async function eliminarModelo(idProvider) {
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

module.exports = {
    obtenerModelo,
    obtenerModelos,
    añadirModelo,
    eliminarModelo
};
