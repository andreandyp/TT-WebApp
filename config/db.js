const Sequelize = require("sequelize");
const AdministratorModel = require("../models/Administrator");
const ProviderModel = require("../models/Provider");
const ModelModel = require("../models/Model");
const ColorModel = require("../models/Color");
const ModelHasColorModel = require("../models/ModelHasColor");
const SocialNetworkModel = require("../models/SocialNetworks");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
});

const Administrator = AdministratorModel(sequelize, Sequelize);
const Provider = ProviderModel(sequelize, Sequelize);
const Model = ModelModel(sequelize, Sequelize);
const Color = ColorModel(sequelize, Sequelize);
const ModelHasColor = ModelHasColorModel(sequelize, Sequelize);
const SocialNetwork = SocialNetworkModel(sequelize, Sequelize);

// Asociar un administrador a varios proveedores
Administrator.hasMany(Provider, {
    foreignKey: "Administrator_idAdministrator",
    sourceKey: "idAdministrator",
});

Provider.belongsTo(Administrator, {
    foreignKey: "Administrator_idAdministrator",
    targetKey: "idAdministrator",
});

// Asociar un proveedor a varios modelos
Provider.hasMany(Model, {
    foreignKey: "Provider_idProvider",
    sourceKey: "idProvider",
});

Model.belongsTo(Provider, {
    foreignKey: "Provider_idProvider",
    targetKey: "idProvider",
});

// Asociar modelos y colores
Model.associate = models => {
    Model.belongsToMany(models.color, {
        through: "model_has_color",
        as: "colors",
        foreignKey: "Model_idModel",
        otherKey: "Color_idColor",
    });
};

Color.associate = models => {
    Color.belongsToMany(models.model, {
        through: "model_has_color",
        as: "colors",
        foreignKey: "Color_idColor",
        otherKey: "Model_idModel",
    });
};

// Asociar un proveedor a varias redes sociales
Provider.hasMany(SocialNetwork, {
    foreignKey: "Provider_idProvider",
    sourceKey: "idProvider",
});

SocialNetwork.belongsTo(Provider, {
    foreignKey: "Provider_idProvider",
    targetKey: "idProvider",
});

sequelize.sync().then(() => console.log("Modelos sincronizados"));

module.exports = {
    Administrator,
    Provider,
    Model,
    Color,
    ModelHasColor,
    SocialNetwork,
};
