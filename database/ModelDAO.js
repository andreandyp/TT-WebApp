const {
    Model,
    Type,
    PredefinedStyle,
    Category,
    ModelHasCategory,
    ModelHasPredefinedStyle,
    ModelHasType,
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
                "medidas",
                "codigo",
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
                    through: {
                        attributes: [],
                    },
                    attributes: ["idType", "nameType"],
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
                "medidas",
                "codigo",
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
                    through: {
                        attributes: [],
                    },
                    attributes: ["idType", "nameType"],
                },
            ],
        });

        return { status: 200, mensaje: modelos };
    } catch (error) {
        return { status: 500, mensaje: error };
    }
}

async function añadirModelo({ datosModelo, idProvider, modelo3d, modelo2d }) {
    const { name, price, description, color, codigo, medidas } = datosModelo;

    if (!name || !price || !description || !color || !codigo || !medidas) {
        return { status: 400, mensaje: "Faltan datos del modelo" };
    }

    let { type, style, category } = datosModelo;
    if (!type || !style || !category) {
        return { status: 400, mensaje: "Falta tipo, estilo y/o categoría" };
    }

    type = type.toUpperCase().split(",");
    style = style.toUpperCase().split(",");
    category = category.toUpperCase().split(",");

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

        const [tipos, estilos, categorias] = await Promise.all([
            tipo,
            estilo,
            categoria,
        ]);

        if (tipos.length === 0 || tipos.length !== type.length) {
            return {
                status: 400,
                mensaje: "No existe alguno de los tipos o todos",
            };
        }

        if (estilos.length === 0 || estilos.length !== style.length) {
            return {
                status: 400,
                mensaje: "No existe alguno de los estilos o todos",
            };
        }

        if (categorias.length === 0 || categorias.length !== category.length) {
            return {
                status: 400,
                mensaje: "No existe alguna de las categorias o todas",
            };
        }

        const nuevoModelo = await Model.create({
            name,
            price,
            description,
            color,
            Provider_idProvider: idProvider,
            codigo,
            medidas,
        });

        const { idModel } = nuevoModelo;

        const nuevasCategorias = categorias.map(({ idCategory }) => ({
            Model_idModel: idModel,
            Category_idCategory: idCategory,
        }));

        const nuevosEstilos = estilos.map(({ idPredefinedStyle }) => ({
            Model_idModel: idModel,
            PredefinedStyle_idPredefinedStyle: idPredefinedStyle,
        }));

        const nuevosTipos = tipos.map(({ idType }) => ({
            Model_idModel: idModel,
            Type_idType: idType,
        }));

        await Promise.all([
            ModelHasCategory.bulkCreate(nuevasCategorias),
            ModelHasPredefinedStyle.bulkCreate(nuevosEstilos),
            ModelHasType.bulkCreate(nuevosTipos),
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

        return await obtenerModelo(idModel, idProvider);
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
