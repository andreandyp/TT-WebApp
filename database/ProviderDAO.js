const { Provider, SocialNetwork, Store } = require("../config/db");

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
            socialNetworks = [],
            stores = [],
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

        const redesSociales = socialNetworks.map(red => ({
            socialNetworkUrl: red,
            Provider_idProvider: idProvider,
        }));

        await SocialNetwork.bulkCreate(redesSociales);

        const tiendas = stores.map(store => ({
            address: store.address,
            phone: store.phone,
            email: store.email,
            Provider_idProvider: idProvider,
        }));

        await Store.bulkCreate(tiendas);

        return {
            status: 200,
            mensaje: await obtenerInfo(idProvider),
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

async function obtenerInfo(idProvider) {
    try {
        const [proveedor] = await Provider.findAll({
            attributes: [
                "username",
                "rfc",
                "razonSocial",
                "tipo",
                "persona",
                "categoria",
            ],
            where: {
                idProvider,
            },
            include: [
                SocialNetwork,
                {
                    model: Store,
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
            mensaje: error,
        };
    }
}

module.exports = {
    actualizarInfoProveedor,
    corregirInfoProveedor,
};
