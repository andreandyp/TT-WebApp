const Sequelize = require("sequelize");
const AdministratorModel = require("../models/Administrator");
const ProviderModel = require("../models/Proveedor");
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

Administrator.hasMany(Provider, {
    foreignKey: "Administrator_idAdministrator",
    sourceKey: "idAdministrator",
});

Provider.hasMany(Model, {
    foreignKey: "Provider_idProvider",
    sourceKey: "idProvider",
});

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

Provider.hasMany(SocialNetwork, {
    foreignKey: "Provider_idProvider",
    sourceKey: "idProvider",
});

module.exports = {
    Administrator,
    Provider,
    Model,
    Color,
    ModelHasColor,
    SocialNetwork,
};
