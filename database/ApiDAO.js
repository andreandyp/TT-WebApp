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

module.exports = {
    obtenerModelos,
};
