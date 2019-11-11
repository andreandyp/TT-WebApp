const bcrypt = require("bcrypt-nodejs");

const { Provider, Administrator } = require("../config/db");

async function obtenerTodosProveedores() {
    try {
        const proveedores = await Provider.findAll({
            attributes: ["idProvider", "username", "name", "eliminable"],
            include: [
                {
                    model: Administrator,
                    attributes: ["idAdministrator", "username"],
                },
            ],
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
                "eliminable",
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
            eliminable: false,
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
        const [proveedorEliminar] = await Provider.findAll({
            where: {
                idProvider,
            },
        });
        if (!proveedorEliminar) {
            return {
                status: 400,
                mensaje: "El proveedor no existe",
            };
        }
        if (!proveedorEliminar.eliminable) {
            return {
                status: 400,
                mensaje: "El proveedor no se puede eliminar",
            };
        }
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
