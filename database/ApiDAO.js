const { Model, Provider } = require("../config/db");
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
            include: [
                {
                    model: Provider,
                    as: "provider",
                    attributes: [
                        "name",
                        "phone",
                        "email",
                        "rfc",
                        "razonSocial",
                        "direccion",
                        "tipo",
                        "persona",
                        "categoria",
                    ],
                },
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

module.exports = {
    obtenerModelos,
};
