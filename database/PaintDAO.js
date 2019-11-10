const { Paint } = require("../config/db");

async function obtenerPinturas(idProvider) {
    try {
        const pinturas = await Paint.findAll({
            attributes: [
                "idPaint",
                "name",
                "vendorCode",
                "rgbCode",
                "hexCode",
                "price",
                "presentacion",
                "Provider_idProvider",
            ],
            where: {
                Provider_idProvider: idProvider,
            },
        });

        return {
            status: 200,
            mensaje: pinturas,
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function obtenerPintura(idPaint, idProvider) {
    try {
        const pinturas = await Paint.findAll({
            attributes: [
                "idPaint",
                "name",
                "vendorCode",
                "rgbCode",
                "hexCode",
                "price",
                "presentacion",
                "Provider_idProvider",
            ],
            where: {
                Provider_idProvider: idProvider,
                idPaint,
            },
        });

        return {
            status: 200,
            mensaje: pinturas,
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function añadirPintura({ datosPintura, idProvider }) {
    try {
        const {
            name,
            vendorCode,
            rgbCode,
            hexCode,
            price,
            presentacion,
        } = datosPintura;
        if (
            !name ||
            !vendorCode ||
            !price ||
            !presentacion ||
            (!rgbCode && !hexCode)
        ) {
            console.log(idProvider);
            return {
                status: 400,
                mensaje: "Faltan datos de la pintura",
            };
        }

        const { idPaint } = await Paint.create({
            name,
            vendorCode,
            rgbCode,
            hexCode,
            price,
            presentacion,
            Provider_idProvider: idProvider,
        });

        return await obtenerPintura(idPaint, idProvider);
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function modificarPintura({ datosPintura, idProvider }) {
    try {
        const {
            idPaint,
            name,
            vendorCode,
            rgbCode,
            hexCode,
            price,
            presentacion,
        } = datosPintura;

        await Paint.update(
            {
                name,
                vendorCode,
                rgbCode,
                hexCode,
                price,
                presentacion,
            },
            {
                where: {
                    Provider_idProvider: idProvider,
                    idPaint,
                },
            }
        );

        return await obtenerPintura(idPaint, idProvider);
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function eliminarPintura(idPaint, idProvider) {
    try {
        await Paint.destroy({
            where: {
                Provider_idProvider: idProvider,
                idPaint,
            },
        });

        return {
            status: 200,
            mensaje: "Pintura eliminada",
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

module.exports = {
    añadirPintura,
    obtenerPintura,
    obtenerPinturas,
    modificarPintura,
    eliminarPintura,
};
