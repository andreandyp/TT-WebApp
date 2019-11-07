const {
    Model,
    Type,
    PredefinedStyle,
    Category,
    Provider,
    SocialNetwork,
    Store,
    Paint,
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
                "color",
                "medidas",
                "codigo",
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
                    attributes: ["idPredefinedStyle"],
                },
                {
                    model: Category,
                    through: {
                        attributes: [],
                    },
                    attributes: ["idCategory"],
                },
                {
                    model: Type,
                    through: {
                        attributes: [],
                    },
                    attributes: ["idType"],
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
                        expires: Date.now() + 3600000 * 24 * 30, // 1 mes 😅
                    });
            }

            const [url2D] = await firebaseStorage
                .file(modelo.file2D)
                .getSignedUrl({
                    action: "read",
                    expires: Date.now() + 3600000 * 24 * 30, // 1 mes 😅
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
                    attributes: ["idCategory"],
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

async function obtenerDatos() {
    try {
        const [tipos, categorias, estilos] = await Promise.all([
            Type.findAll(),
            Category.findAll(),
            PredefinedStyle.findAll(),
        ]);

        return {
            status: 200,
            mensaje: {
                tipos,
                estilos,
                categorias,
            },
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function obtenerPinturas() {
    try {
        const pinturas = await Paint.findAll({
            attributes: [
                "idPaint",
                "name",
                "vendorCode",
                "rgbCode",
                "hexCode",
                "Provider_idProvider",
            ],
        });

        return {
            status: 200,
            mensaje: pinturas,
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function obtenerEscenas() {}

module.exports = {
    obtenerModelos,
    obtenerProveedores,
    obtenerDatos,
    obtenerPinturas,
    obtenerEscenas,
};
