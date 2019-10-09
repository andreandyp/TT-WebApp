const { Provider, SocialNetwork } = require("../config/db");

async function actualizarInfoProveedor(infoProveedor, idProvider) {
    try {
        const {
            phone,
            email,
            rfc,
            razonSocial,
            direccion,
            tipo,
            persona,
            categoria,
            socialNetworks,
        } = infoProveedor;

        await Provider.update(
            {
                phone,
                email,
                rfc,
                razonSocial,
                direccion,
                tipo,
                persona,
                categoria,
            },
            {
                where: {
                    idProvider,
                },
            }
        );

        socialNetworks.forEach(async url => {
            await SocialNetwork.create({
                socialNetworkUrl: url,
                Provider_idProvider: idProvider,
            });
        });

        const [proveedor] = await Provider.findAll({
            attributes: [
                "username",
                "phone",
                "email",
                "rfc",
                "razonSocial",
                "direccion",
                "tipo",
                "persona",
                "categoria",
            ],
            where: {
                idProvider,
            },
            include: [
                {
                    model: SocialNetwork,
                    as: "socialnetworks",
                    attributes: ["idSocialNetwork", "socialNetworkUrl"],
                    where: {
                        Provider_idProvider: idProvider,
                    },
                },
            ],
        });

        return {
            status: 200,
            mensaje: proveedor,
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

async function corregirInfoProveedor(infoProveedor, idProvider) {
    try {
        const {
            phone,
            email,
            rfc,
            razonSocial,
            direccion,
            tipo,
            persona,
            categoria,
            socialNetworks,
        } = infoProveedor;

        await Provider.update(
            {
                phone,
                email,
                rfc,
                razonSocial,
                direccion,
                tipo,
                persona,
                categoria,
            },
            {
                where: {
                    idProvider,
                },
            }
        );

        if (socialNetworks && Array.isArray(socialNetworks)) {
            socialNetworks.forEach(async elem => {
                if (typeof elem === "number") {
                    await SocialNetwork.destroy({
                        where: {
                            idSocialNetwork: elem,
                            Provider_idProvider: idProvider,
                        },
                    });
                } else {
                    await SocialNetwork.update(
                        {
                            socialNetworkUrl: elem.socialNetworkUrl,
                        },
                        {
                            where: {
                                idSocialNetwork: elem.idSocialNetwork,
                                Provider_idProvider: idProvider,
                            },
                        }
                    );
                }
            });
        }

        const [proveedor] = await Provider.findAll({
            attributes: [
                "username",
                "phone",
                "email",
                "rfc",
                "razonSocial",
                "direccion",
                "tipo",
                "persona",
                "categoria",
            ],
            where: {
                idProvider,
            },
            include: [
                {
                    model: SocialNetwork,
                    as: "socialnetworks",
                    attributes: ["idSocialNetwork", "socialNetworkUrl"],
                    where: {
                        Provider_idProvider: idProvider,
                    },
                },
            ],
        });

        return {
            status: 200,
            mensaje: proveedor,
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: error.toString(),
        };
    }
}

module.exports = {
    actualizarInfoProveedor,
    corregirInfoProveedor,
};
