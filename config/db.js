const Sequelize = require("sequelize");

const AdministratorModel = require("../models/Administrator");
const CategoryModel = require("../models/Category");
const ModelModel = require("../models/Model");
const ModelHasCategoryModel = require("../models/ModelHasCategory");
const ModelHasPredefinedStyleModel = require("../models/ModelHasPredefinedStyle");
const PaintModel = require("../models/Paint");
const PredefinedStyleModel = require("../models/PredefinedStyle");
const ProviderModel = require("../models/Provider");
const ProviderHasTypeModel = require("../models/ProviderHasType");
const SocialNetworkModel = require("../models/SocialNetworks");
const StoreModel = require("../models/Store");
const TypeModel = require("../models/Type");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
});

const Administrator = AdministratorModel(sequelize, Sequelize);
const Category = CategoryModel(sequelize, Sequelize);
const Model = ModelModel(sequelize, Sequelize);
const ModelHasCategory = ModelHasCategoryModel(sequelize, Sequelize);
const ModelHasPredefinedStyle = ModelHasPredefinedStyleModel(
    sequelize,
    Sequelize
);
const Paint = PaintModel(sequelize, Sequelize);
const PredefinedStyle = PredefinedStyleModel(sequelize, Sequelize);
const Provider = ProviderModel(sequelize, Sequelize);
const ProviderHasType = ProviderHasTypeModel(sequelize, Sequelize);
const SocialNetwork = SocialNetworkModel(sequelize, Sequelize);
const Store = StoreModel(sequelize, Sequelize);
const Type = TypeModel(sequelize, Sequelize);

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

// Asociar un proveedor a varias pinturas
Provider.hasMany(Paint, {
    foreignKey: "Provider_idProvider",
    sourceKey: "idProvider",
});

Paint.belongsTo(Provider, {
    foreignKey: "Provider_idProvider",
    targetKey: "idProvider",
});

// Asociar un tipo a varios proveedores
Type.hasMany(Provider, {
    foreignKey: "Type_idType",
    sourceKey: "idType",
});

Provider.belongsTo(Type, {
    foreignKey: "Type_idType",
    targetKey: "idType",
});

// Asociar modelos y estilos predefinidos
Model.associate = models => {
    Model.belongsToMany(models.predefinedstyle, {
        through: "model_has_predefinedstyle",
        as: "predefinedstyles",
        foreignKey: "Model_idModel",
        otherKey: "PredefinedStyle_idPredefinedStyle",
    });
};

PredefinedStyle.associate = models => {
    PredefinedStyle.belongsToMany(models.model, {
        through: "model_has_predefinedstyle",
        as: "predefinedstyles",
        foreignKey: "PredefinedStyle_idPredefinedStyle",
        otherKey: "Model_idModel",
    });
};

// Asociar modelos y categorías
Model.associate = models => {
    Model.belongsToMany(models.category, {
        through: "model_has_category",
        as: "categories",
        foreignKey: "Model_idModel",
        otherKey: "Category_idCategory",
    });
};

Category.associate = models => {
    Category.belongsToMany(models.model, {
        through: "model_has_category",
        as: "categories",
        foreignKey: "Model_idModel",
        otherKey: "Category_idCategory",
    });
};

// Asociar proveedores y tipos
Provider.associate = models => {
    Provider.belongsToMany(models.type, {
        through: "provider_has_type",
        as: "types",
        foreignKey: "Provider_idProvider",
        otherKey: "Type_idType",
    });
};

Type.associate = models => {
    Type.belongsToMany(models.provider, {
        through: "provider_has_type",
        as: "types",
        foreignKey: "Provider_idProvider",
        otherKey: "Type_idType",
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

// Asociar un proveedor a varias tiendas
Provider.hasMany(Store, {
    foreignKey: "Provider_idProvider",
    sourceKey: "idProvider",
});

Store.belongsTo(Provider, {
    foreignKey: "Provider_idProvider",
    targetKey: "idProvider",
});

const force = false;
sequelize.sync({ force }).then(() => console.log("Modelos sincronizados"));

module.exports = {
    Administrator,
    Category,
    Model,
    ModelHasCategory,
    ModelHasPredefinedStyle,
    Paint,
    PredefinedStyle,
    Provider,
    ProviderHasType,
    SocialNetwork,
    Store,
    Type,
    sequelize,
};
