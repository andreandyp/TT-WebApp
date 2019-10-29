const {
    Provider,
    SocialNetwork,
    Store,
    ProviderHasCategory,
    Category,
} = require("../config/db");

async function actualizarInfoProveedor(infoProveedor, idProvider) {
    try {
        const {
            rfc,
            razonSocial,
            persona,
            rango,
            socialNetworks = [],
            stores = [],
            category = [],
        } = infoProveedor;

        const categorias = await Category.findAll({
            where: {
                category,
            },
        });

        const nuevasCategorias = categorias.map(({ idCategory }) => ({
            Provider_idProvider: idProvider,
            Category_idCategory: idCategory,
        }));

        await Promise.all([
            Provider.update(
                {
                    rfc,
                    razonSocial,
                    persona,
                    rango,
                },
                {
                    where: {
                        idProvider,
                    },
                }
            ),
            ProviderHasCategory.bulkCreate(nuevasCategorias),
        ]);

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

        return await obtenerInfo(idProvider);
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
            rfc,
            razonSocial,
            persona,
            rango,
            socialNetworks = [],
            stores = [],
            tipo = [],
        } = infoProveedor;

        await Provider.update(
            {
                rfc,
                razonSocial,
                persona,
                rango,
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
                "name",
                "rfc",
                "razonSocial",
                "persona",
                "rango",
            ],
            where: {
                idProvider,
            },
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
