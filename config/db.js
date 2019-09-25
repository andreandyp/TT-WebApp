const Sequelize = require("sequelize");
const AdministratorModel = require("../models/Administrator");
const ProviderModel = require("../models/Proveedor");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
});

const Administrator = AdministratorModel(sequelize, Sequelize);
const Provider = ProviderModel(sequelize, Sequelize);

module.exports = {
    Administrator,
    Provider,
};
