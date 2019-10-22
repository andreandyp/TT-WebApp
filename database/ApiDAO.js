const {
    Model,
    Provider,
    SocialNetwork,
    Store,
    Phone,
    Email,
} = require("../config/db");
const firebase = require("../config/firebase");

async function obtenerModelos() {
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
                "createdAt",
                "updatedAt",
            ],
        });

        const firebaseStorage = firebase.bucket();

        for (const modelo of modelos) {
            const [urlAR] = await firebaseStorage
                .file(modelo.fileAR)
                .getSignedUrl({
                    action: "read",
                    expires: Date.now() + 7200000, // 2 horas de acceso... por si acaso
                });

            const [url2D] = await firebaseStorage
                .file(modelo.file2D)
                .getSignedUrl({
                    action: "read",
                    expires: Date.now() + 7200000, // 2 horas de acceso... por si acaso
                });

            modelo.fileAR = urlAR;
            modelo.file2D = url2D;
        }

        return {
            status: 200,
            mensaje: modelos,
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error,
        };
    }
}

async function obtenerProveedores() {
    try {
        const proveedores = await Provider.findAll({
            attributes: [
                "idProvider",
                "name",
                "rfc",
                "razonSocial",
                "tipo",
                "persona",
                "categoria",
            ],
            include: [
                {
                    model: SocialNetwork,
                    as: "socialnetwork",
                },
                {
                    model: Store,
                    as: "store",
                    include: [Email, Phone],
                },
            ],
        });

        return {
            status: 200,
            mensaje: proveedores,
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error,
        };
    }
}

module.exports = {
    obtenerModelos,
    obtenerProveedores,
};
