const {
    Model,
    Type,
    PredefinedStyle,
    Category,
    Provider,
    SocialNetwork,
    Store,
} = require("../config/db");
const firebase = require("../config/firebase");

async function obtenerModelos() {
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

        const firebaseStorage = firebase.bucket();

        for (const modelo of modelos) {
            if (modelo.fileAR) {
                var [urlAR] = await firebaseStorage
                    .file(modelo.fileAR)
                    .getSignedUrl({
                        action: "read",
                        expires: Date.now() + 7200000, // 2 horas de acceso... por si acaso
                    });
            }

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
        console.log(error);
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
                "persona",
                "rango",
            ],
            include: [
                {
                    model: SocialNetwork,
                    attributes: ["idSocialNetwork", "socialNetworkUrl"],
                },
                {
                    model: Store,
                    attributes: ["idStore", "address", "phone", "email"],
                },
                {
                    model: Category,
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        return {
            status: 200,
            mensaje: proveedores,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

module.exports = {
    obtenerModelos,
    obtenerProveedores,
};
