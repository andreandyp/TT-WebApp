const { Model, Color, ModelHasColor } = require("../config/db");
const firebase = require("../config/firebase");

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

async function añadirModelo(datosModelo, idProvider, modelo3d, modelo2d) {
    const { name, type, style, category, price, description } = datosModelo;

    if (!name || !type || !style || !category || !price || !description) {
        return { status: 400, mensaje: "Faltan datos del modelo" };
    }

    const { nameColor, rgbCode } = datosModelo;
    if (!nameColor || !rgbCode) {
        return { status: 400, mensaje: "Faltan datos del color" };
    }

    try {
        const [nuevoModelo, nuevoColor] = await Promise.all([
            Model.create({
                name,
                type,
                style,
                category,
                price,
                description,
                Provider_idProvider: idProvider,
            }),
            Color.create({
                name: nameColor,
                rgbCode,
            }),
        ]);

        const { idModel } = nuevoModelo;

        const {
            originalname: original3d,
            path: path3d,
            mimetype: mime3d,
        } = modelo3d;

        const {
            originalname: original2d,
            path: path2d,
            mimetype: mime2d,
        } = modelo2d;

        const ref3d = `${idProvider}/${idModel}/${original3d}`;
        const ref2d = `${idProvider}/${idModel}/${original2d}`;

        const firebase3d = firebase.bucket().upload(path3d, {
            destination: ref3d,
            metadata: {
                contentType: mime3d,
            },
        });

        const firebase2d = firebase.bucket().upload(path2d, {
            destination: ref2d,
            metadata: {
                contentType: mime2d,
            },
        });

        await Promise.all([firebase3d, firebase2d]);

        await Promise.all([
            nuevoModelo.update({
                fileAR: ref3d,
                file2D: ref2d,
            }),

            ModelHasColor.create({
                Model_idModel: idModel,
                Color_idColor: nuevoColor.idColor,
            }),
        ]);

        return {
            status: 200,
            mensaje: "Modelo creado",
        };
    } catch (error) {
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
