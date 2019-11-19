const {
    ARScene,
    Type,
    PredefinedStyle,
    ARSceneHasModel,
} = require("../config/db");
const firebase = require("../config/firebase");

async function obtenerEscenas(idProvider) {
    try {
        const escenas = await ARScene.findAll({
            attributes: ["idARScene", "name", "imagen", "Provider_idProvider"],
            where: {
                Provider_idProvider: idProvider,
            },
            include: [
                {
                    model: Type,
                    attributes: ["nameType"],
                },
                {
                    model: PredefinedStyle,
                    attributes: ["style"],
                },
            ],
        });

        const firebaseStorage = firebase.bucket();

        for (const escena of escenas) {
            if (escena.imagen) {
                const [url] = await firebaseStorage
                    .file(escena.imagen)
                    .getSignedUrl({
                        action: "read",
                        expires: Date.now() + 3600000, // 1 hora 😅
                    });

                escena.imagen = url;
            }
        }

        return {
            status: 200,
            mensaje: escenas,
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function obtenerEscena(idARScene, idProvider) {
    try {
        const [escena] = await ARScene.findAll({
            attributes: ["idARScene", "name", "imagen"],
            where: {
                Provider_idProvider: idProvider,
                idARScene,
            },
            include: [
                {
                    model: Type,
                    attributes: ["nameType"],
                },
                {
                    model: PredefinedStyle,
                    attributes: ["style"],
                },
            ],
        });

        const firebaseStorage = firebase.bucket();
        if (escena.imagen) {
            const [url] = await firebaseStorage
                .file(escena.imagen)
                .getSignedUrl({
                    action: "read",
                    expires: Date.now() + 3600000, // 1 hora 😅
                });

            escena.imagen = url;
        }

        return {
            status: 200,
            mensaje: escena,
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function añadirEscena({ datosEscena, idProvider }) {
    try {
        const { name, tipo, estilo, modelos = [] } = datosEscena;
        if (!name || !tipo || !estilo) {
            return {
                status: 400,
                mensaje: "Faltan datos de la escena",
            };
        }

        const [{ idType }] = await Type.findAll({
            where: {
                nameType: tipo,
            },
        });

        const [{ idPredefinedStyle }] = await PredefinedStyle.findAll({
            where: {
                style: estilo,
            },
        });

        const { idARScene } = await ARScene.create({
            name,
            Type_idType: idType,
            PredefinedStyle_idPredefinedStyle: idPredefinedStyle,
            Provider_idProvider: idProvider,
        });

        const nuevosModelos = modelos.map(idModel => ({
            Model_idModel: idModel,
            ARScene_idARScene: idARScene,
        }));

        await ARSceneHasModel.bulkCreate(nuevosModelos);

        return await obtenerEscena(idARScene, idProvider);
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function modificarEscena({ datosEscena, idProvider }) {
    try {
        const {
            idARScene,
            name,
            imagen,
            tipo,
            estilo,
            modelos = [],
        } = datosEscena;

        const [{ idType }] = Type.findAll({
            where: {
                nameType: tipo,
            },
        });

        const [{ idPredefinedStyle }] = Type.findAll({
            where: {
                style: estilo,
            },
        });

        await ARScene.update(
            {
                name,
                imagen,
                Type_idType: idType,
                PredefinedStyle_idPredefinedStyle: idPredefinedStyle,
            },
            {
                where: {
                    idARScene,
                },
            }
        );

        await ARSceneHasModel.destroy({
            where: {
                ARScene_idARScene: idARScene,
            },
        });

        const nuevosModelos = modelos.map(modelo => ({
            Model_idModel: modelo.idModel,
            ARScene_idARScene: idARScene,
        }));

        await ARSceneHasModel.bulkCreate(nuevosModelos);

        return await obtenerEscena(idARScene, idProvider);
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function eliminarEscena(idARScene, idProvider) {
    try {
        await ARScene.destroy({
            where: {
                Provider_idProvider: idProvider,
                idARScene,
            },
        });

        return {
            status: 200,
            mensaje: "Escena eliminada",
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function subirImagenEscena(imagenEscena, idProvider, idARScene) {
    const { originalname, mimetype } = imagenEscena;
    const archivoFirebase = new Promise((resolve, reject) => {
        const refEscena = `${idProvider}/escenas/${idARScene}/${originalname}`;
        const refFB = firebase.bucket().file(refEscena);

        const blobStream = refFB.createWriteStream({
            metadata: {
                contentType: mimetype,
            },
        });

        blobStream.on("error", reject);

        blobStream.on("finish", () => {
            resolve(refEscena);
        });

        blobStream.end(imagenEscena.buffer);
    });

    try {
        await Promise.all([
            archivoFirebase,
            ARScene.update(
                {
                    imagen: `${idProvider}/escenas/${idARScene}/${originalname}`,
                },
                {
                    where: {
                        Provider_idProvider: idProvider,
                        idARScene,
                    },
                }
            ),
        ]);

        return {
            status: 200,
            mensaje: "Imagen de escena subida",
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

module.exports = {
    obtenerEscenas,
    obtenerEscena,
    añadirEscena,
    modificarEscena,
    eliminarEscena,
    subirImagenEscena,
};
