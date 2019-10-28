const {
    Model,
    Type,
    PredefinedStyle,
    Category,
    ModelHasCategory,
    ModelHasPredefinedStyle,
} = require("../config/db");
const firebase = require("../config/firebase");

async function obtenerModelo(idModel, idProvider) {
    try {
        const [modelo] = await Model.findAll({
            attributes: [
                "idModel",
                "name",
                "fileAR",
                "price",
                "description",
                "file2D",
                "createdAt",
                "updatedAt",
                "Provider_idProvider",
            ],
            where: {
                idModel,
                Provider_idProvider: idProvider,
            },
            include: [
                {
                    model: PredefinedStyle,
                    through: {
                        attributes: [],
                    },
                    attributes: ["idPredefinedStyle", "style"],
                },
                {
                    model: Category,
                    through: {
                        attributes: [],
                    },
                    attributes: ["idCategory", "category"],
                },
                {
                    model: Type,
                },
            ],
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
                "fileAR",
                "price",
                "description",
                "file2D",
                "createdAt",
                "updatedAt",
                "Provider_idProvider",
            ],
            where: {
                Provider_idProvider: idProvider,
            },
            include: [
                {
                    model: PredefinedStyle,
                    through: {
                        attributes: [],
                    },
                    attributes: ["idPredefinedStyle", "style"],
                },
                {
                    model: Category,
                    through: {
                        attributes: [],
                    },
                    attributes: ["idCategory", "category"],
                },
                {
                    model: Type,
                },
            ],
        });

        return { status: 200, mensaje: modelos };
    } catch (error) {
        return { status: 500, mensaje: error };
    }
}

async function añadirModelo({ datosModelo, idProvider, modelo3d, modelo2d }) {
    const { name, price, description, color } = datosModelo;

    if (!name || !price || !description || !color) {
        return { status: 400, mensaje: "Faltan datos del modelo" };
    }

    const { type, style, category } = datosModelo;
    if (!type || !style || !category) {
        return { status: 400, mensaje: "Falta tipo, estilo y/o categoría" };
    }

    try {
        const tipo = Type.findAll({
            where: {
                nameType: type,
            },
        });
        const estilo = PredefinedStyle.findAll({
            where: {
                style,
            },
        });
        const categoria = Category.findAll({
            where: {
                category,
            },
        });
        const [
            [{ idType }],
            [{ idPredefinedStyle }],
            [{ idCategory }],
        ] = await Promise.all([tipo, estilo, categoria]);

        const nuevoModelo = await Model.create({
            name,
            price,
            description,
            color,
            Type_idType: idType,
            Provider_idProvider: idProvider,
        });

        const { idModel } = nuevoModelo;

        await Promise.all([
            ModelHasCategory.create({
                Model_idModel: idModel,
                Category_idCategory: idCategory,
            }),
            ModelHasPredefinedStyle.create({
                Model_idModel: idModel,
                PredefinedStyle_idPredefinedStyle: idPredefinedStyle,
            }),
        ]);

        if (modelo3d) {
            const ref3dFB = subirAFirebase(modelo3d, idProvider, idModel);
            const ref2dFB = subirAFirebase(modelo2d, idProvider, idModel);

            const [ref3d, ref2d] = await Promise.all([ref3dFB, ref2dFB]);

            await Promise.all([
                nuevoModelo.update({
                    fileAR: ref3d,
                    file2D: ref2d,
                }),
            ]);
        } else {
            const ref2dFB = subirAFirebase(modelo2d, idProvider, idModel);

            const ref2d = await ref2dFB;

            await Promise.all([
                nuevoModelo.update({
                    fileAR: "",
                    file2D: ref2d,
                }),
            ]);
        }

        return {
            status: 200,
            mensaje: "Modelo creado",
        };
    } catch (error) {
        return { status: 500, mensaje: error.toString() };
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

function subirAFirebase(modelo, idProvider, idModel) {
    return new Promise((resolve, reject) => {
        const { originalname, mimetype } = modelo;

        const refModelo = `${idProvider}/${idModel}/${originalname}`;
        const refFB = firebase.bucket().file(refModelo);

        const blobStream = refFB.createWriteStream({
            metadata: {
                contentType: mimetype,
            },
        });

        blobStream.on("error", reject);

        blobStream.on("finish", () => {
            resolve(refModelo);
        });

        blobStream.end(modelo.buffer);
    });
}

module.exports = {
    obtenerModelo,
    obtenerModelos,
    añadirModelo,
    eliminarModelo,
};
