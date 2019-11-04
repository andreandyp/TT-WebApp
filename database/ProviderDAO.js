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

        if (categorias.length !== category.length) {
            return {
                status: 400,
                mensaje: "Una o más de las categorías no existen",
            };
        }

        const nuevasCategorias = categorias.map(({ idCategory }) => ({
            Provider_idProvider: idProvider,
            Category_idCategory: idCategory,
        }));

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
        await ProviderHasCategory.bulkCreate(nuevasCategorias);

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
            categories = [],
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

        for (let store of stores) {
            if (typeof store === "number") {
                await Store.destroy({
                    where: {
                        idStore: store,
                        Provider_idProvider: idProvider,
                    },
                });
            } else {
                await Store.update(
                    {
                        address: store.address || "",
                        phone: store.phone || "",
                        email: store.email || "",
                    },
                    {
                        where: {
                            idStore: store.idStore,
                            Provider_idProvider: idProvider,
                        },
                    }
                );
            }
        }

        for (let network of socialNetworks) {
            if (typeof network === "number") {
                await SocialNetwork.destroy({
                    where: {
                        idSocialNetwork: network,
                        Provider_idProvider: idProvider,
                    },
                });
            } else {
                await SocialNetwork.update(
                    {
                        socialNetworkUrl: network.socialNetworkUrl || "",
                    },
                    {
                        where: {
                            idSocialNetwork: network.idSocialNetwork,
                            Provider_idProvider: idProvider,
                        },
                    }
                );
            }
        }

        const [categorias] = await Promise.all([
            Category.findAll({
                where: {
                    category: categories,
                },
            }),
            await ProviderHasCategory.destroy({
                where: {
                    Provider_idProvider: idProvider,
                },
            }),
        ]);

        const nuevasCategorias = categorias.map(({ idCategory }) => ({
            Provider_idProvider: idProvider,
            Category_idCategory: idCategory,
        }));

        await ProviderHasCategory.bulkCreate(nuevasCategorias);

        return await obtenerInfo(idProvider);
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
