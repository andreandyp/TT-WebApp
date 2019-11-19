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
                "color",
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
                    attributes: ["style"],
                },
                {
                    model: Category,
                    through: {
                        attributes: [],
                    },
                    attributes: ["category"],
                },
                {
                    model: Type,
                    through: {
                        attributes: [],
                    },
                    attributes: ["nameType"],
                },
            ],
        });

        if (!modelo) {
            return { status: 400, mensaje: "El modelo no existe" };
        }

        const firebaseStorage = firebase.bucket();

        if (modelo.fileAR) {
            var [urlAR] = await firebaseStorage
                .file(modelo.fileAR)
                .getSignedUrl({
                    action: "read",
                    expires: Date.now() + 3600000, // 1 hora 😅
                });
        }

        const [url2D] = await firebaseStorage.file(modelo.file2D).getSignedUrl({
            action: "read",
            expires: Date.now() + 3600000, // 1 hora 😅
        });

        modelo.fileAR = urlAR;
        modelo.file2D = url2D;

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
                "color",
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

        const firebaseStorage = firebase.bucket();

        for (const modelo of modelos) {
            if (modelo.fileAR) {
                var [urlAR] = await firebaseStorage
                    .file(modelo.fileAR)
                    .getSignedUrl({
                        action: "read",
                        expires: Date.now() + 3600000, // 1 hora 😅
                    });
            }

            const [url2D] = await firebaseStorage
                .file(modelo.file2D)
                .getSignedUrl({
                    action: "read",
                    expires: Date.now() + 3600000, // 1 hora 😅
                });

            modelo.fileAR = urlAR;
            modelo.file2D = url2D;
        }

        return { status: 200, mensaje: modelos };
    } catch (error) {
        return { status: 500, mensaje: error.toString() };
    }
}

async function añadirModelo({ datosModelo, idProvider, modelo3d, modelo2d }) {
    const {
        name,
        price,
        description = "",
        color,
        codigo = "",
        medidas,
    } = datosModelo;

    if (!name || !price || !color || !medidas) {
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

async function corregirModelo({ datosModelo, idProvider, modelo3d, modelo2d }) {
    const {
        idModel,
        name,
        price,
        description = "",
        color,
        codigo = "",
        medidas,
    } = datosModelo;

    let { type, style, category } = datosModelo;

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

        await Model.update(
            {
                name,
                price,
                description,
                color,
                Provider_idProvider: idProvider,
                codigo,
                medidas,
            },
            {
                where: {
                    idModel,
                },
            }
        );

        const [cats] = await Promise.all([
            Category.findAll({
                where: {
                    category,
                },
            }),
            await ModelHasCategory.destroy({
                where: {
                    Model_idModel: idModel,
                },
            }),
        ]);

        const nuevasCategorias = cats.map(({ idCategory }) => ({
            Model_idModel: idModel,
            Category_idCategory: idCategory,
        }));

        const [stys] = await Promise.all([
            PredefinedStyle.findAll({
                where: {
                    style,
                },
            }),
            await ModelHasPredefinedStyle.destroy({
                where: {
                    Model_idModel: idModel,
                },
            }),
        ]);

        const nuevosEstilos = stys.map(({ idPredefinedStyle }) => ({
            Model_idModel: idModel,
            PredefinedStyle_idPredefinedStyle: idPredefinedStyle,
        }));

        const [typs] = await Promise.all([
            Type.findAll({
                where: {
                    nameType: type,
                },
            }),
            await ModelHasType.destroy({
                where: {
                    Model_idModel: idModel,
                },
            }),
        ]);

        const nuevosTipos = typs.map(({ idType }) => ({
            Model_idModel: idModel,
            Type_idType: idType,
        }));

        await Promise.all([
            ModelHasCategory.bulkCreate(nuevasCategorias),
            ModelHasPredefinedStyle.bulkCreate(nuevosEstilos),
            ModelHasType.bulkCreate(nuevosTipos),
        ]);

        if (modelo3d && modelo2d) {
            const ref3dFB = subirAFirebase(modelo3d, idProvider, idModel);
            const ref2dFB = subirAFirebase(modelo2d, idProvider, idModel);

            const [ref3d, ref2d] = await Promise.all([ref3dFB, ref2dFB]);

            await Promise.all([
                Model.update(
                    {
                        fileAR: ref3d,
                        file2D: ref2d,
                    },
                    {
                        where: {
                            idModel,
                        },
                    }
                ),
            ]);
        } else if (modelo2d) {
            const ref2dFB = subirAFirebase(modelo2d, idProvider, idModel);

            const ref2d = await ref2dFB;

            await Promise.all([
                Model.update(
                    {
                        file2D: ref2d,
                    },
                    {
                        where: {
                            idModel,
                        },
                    }
                ),
            ]);
        } else if (modelo3d) {
            const ref3dFB = subirAFirebase(modelo3d, idProvider, idModel);

            const ref3d = await ref3dFB;

            await Promise.all([
                Model.update(
                    {
                        fileAR: ref3d,
                    },
                    {
                        where: {
                            idModel,
                        },
                    }
                ),
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
            attributes: ["fileAR", "file2D", "Provider_idProvider"],
            where: {
                idModel,
            },
            raw: true,
        });

        if (modeloAEliminar.Provider_idProvider !== idProvider) {
            return { status: 400, mensaje: "Este modelo no es tuyo" };
        }

        if (modeloAEliminar.fileAR) {
            var file3d = firebase
                .bucket()
                .file(modeloAEliminar.fileAR)
                .delete();
        }
        await Promise.all([
            firebase
                .bucket()
                .file(modeloAEliminar.file2D)
                .delete(),
            file3d,
        ]);

        await Model.destroy({
            where: {
                idModel,
                Provider_idProvider: idProvider,
            },
        });

        return { status: 200, mensaje: "Modelo eliminado" };
    } catch (error) {
        return { status: 500, mensaje: error.toString() };
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
    corregirModelo,
};
