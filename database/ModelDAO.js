const { Model, Color, ModelHasColor } = require("../config/db");

async function obtenerModelo(idModel, idProvider) {
    try {
        const [modelo] = await Model.findAll({
            attributes: [
                "idModel",
                "name",
                "type",
                "style",
                "category",
                "fileAR",
                "price",
                "description",
                "file2D",
            ],
            where: {
                idModel,
                Provider_idProvider: idProvider,
            },
            raw: true,
        });

        if (!modelo) {
            return { status: 400, mensaje: "El modelo no existe" };
        }

        return { status: 200, mensaje: modelo };
    } catch (error) {
        return { status: 500, mensaje: error };
    }
}

async function obtenerModelos(idProvider) {
    try {
        const modelos = await Model.findAll({
            attributes: [
                "idModel",
                "name",
                "type",
                "style",
                "category",
                "fileAR",
                "price",
                "description",
                "file2D",
            ],
            where: {
                Provider_idProvider: idProvider,
            },
            raw: true,
        });

        return { status: 200, mensaje: modelos };
    } catch (error) {
        return { status: 500, mensaje: error };
    }
}

async function añadirModelo(datosModelo, idProvider) {
    const { name, type, style, category, price, description } = datosModelo;

    // Oh Dios mío...
    if (!name || !type || !style || !category || !price || !description) {
        return { status: 400, mensaje: "Faltan datos del modelo" };
    }

    const { nameColor, rgbCode } = datosModelo;
    if (!nameColor || !rgbCode) {
        return { status: 400, mensaje: "Faltan datos del color" };
    }

    try {
        const nuevoModelo = await Model.create({
            name,
            type,
            style,
            category,
            price,
            description,
            Provider_idProvider: idProvider,
        });

        const nuevoColor = await Color.create({
            name: nameColor,
            rgbCode,
        });

        await ModelHasColor.create({
            Model_idModel: nuevoModelo.idModel,
            Color_idColor: nuevoColor.idColor,
        });

        return {
            status: 200,
            mensaje: "Modelo creado",
        };
    } catch (error) {
        console.log(error);
        return { status: 500, mensaje: error };
    }
}

async function eliminarModelo(idModel, idProvider) {
    try {
        const [modeloAEliminar] = await Model.findAll({
            where: {
                idModel,
            },
            raw: true,
        });

        if (modeloAEliminar.Provider_idProvider !== idProvider) {
            return { status: 400, mensaje: "Este modelo no es tuyo" };
        }

        await Model.destroy({
            where: {
                idModel,
                Provider_idProvider: idProvider,
            },
        });

        return { status: 200, mensaje: "Modelo eliminado" };
    } catch (error) {
        return { status: 500, mensaje: error };
    }
}

module.exports = {
    obtenerModelo,
    obtenerModelos,
    añadirModelo,
    eliminarModelo,
};
