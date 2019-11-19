const {
    ARScene,
    Type,
    PredefinedStyle,
    ARSceneHasModel,
} = require("../config/db");

async function obtenerEscenas(idProvider) {
    try {
        const escenas = await ARScene.findAll({
            attributes: [
                "idARScene",
                "name",
                "imagen",
                "Provider_idProvider",
                "Type_idType",
                "PredefinedStyle_idPredefinedStyle",
            ],
            where: {
                Provider_idProvider: idProvider,
            },
        });

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
            attributes: [
                "idARScene",
                "name",
                "imagen",
                "Provider_idProvider",
                "Type_idType",
                "PredefinedStyle_idPredefinedStyle",
            ],
            where: {
                Provider_idProvider: idProvider,
                idARScene,
            },
        });

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
        const { name, imagen, tipo, estilo, modelos = [] } = datosEscena;
        if (!name || !imagen || !tipo || !estilo) {
            return {
                status: 400,
                mensaje: "Faltan datos de la escena",
            };
        }

        const [{ idType }] = Type.findAll({
            where: {
                nameType: tipo,
            },
        });

        const [{ idPredefinedStyle }] = PredefinedStyle.findAll({
            where: {
                style: estilo,
            },
        });

        const { idARScene } = await ARScene.create({
            name,
            imagen,
            Type_idType: idType,
            PredefinedStyle_idPredefinedStyle: idPredefinedStyle,
            Provider_idProvider: idProvider,
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

module.exports = {
    obtenerEscenas,
    obtenerEscena,
    añadirEscena,
    modificarEscena,
    eliminarEscena,
};
