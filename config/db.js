const Sequelize = require("sequelize");

const AdministratorModel = require("../models/Administrator");
const CategoryModel = require("../models/Category");
const ModelModel = require("../models/Model");
const ModelHasCategoryModel = require("../models/ModelHasCategory");
const ModelHasPredefinedStyleModel = require("../models/ModelHasPredefinedStyle");
const PaintModel = require("../models/Paint");
const PredefinedStyleModel = require("../models/PredefinedStyle");
const ProviderModel = require("../models/Provider");
const ProviderHasCategoryModel = require("../models/ProviderHasCategory");
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
const ProviderHasCategory = ProviderHasCategoryModel(sequelize, Sequelize);
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

// Asociar proveedores y categorías
Category.belongsToMany(Provider, {
    through: ProviderHasCategory,
    foreignKey: "Category_idCategory",
    otherKey: "Provider_idProvider",
});

Provider.belongsToMany(Category, {
    through: ProviderHasCategory,
    foreignKey: "Provider_idProvider",
    otherKey: "Category_idCategory",
});

// Asociar modelos y estilos predefinidos
Model.belongsToMany(PredefinedStyle, {
    through: ModelHasPredefinedStyle,
    foreignKey: "Model_idModel",
    otherKey: "PredefinedStyle_idPredefinedStyle",
});

PredefinedStyle.belongsToMany(Model, {
    through: ModelHasPredefinedStyle,
    foreignKey: "PredefinedStyle_idPredefinedStyle",
    otherKey: "Model_idModel",
});

// Asociar modelos y categorías
Model.belongsToMany(Category, {
    through: ModelHasCategory,
    foreignKey: "Model_idModel",
    otherKey: "Category_idCategory",
});

Category.belongsToMany(Model, {
    through: ModelHasCategory,
    foreignKey: "Category_idCategory",
    otherKey: "Model_idModel",
});

// Asociar un tipo a varios modelos
Type.hasMany(Model, {
    foreignKey: "Type_idType",
    sourceKey: "idType",
});

Model.belongsTo(Type, {
    foreignKey: "Type_idType",
    targetKey: "idType",
});

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
    ProviderHasCategory,
    SocialNetwork,
    Store,
    Type,
    sequelize,
};
