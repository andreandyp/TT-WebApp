function init(sequelize, Sequelize) {
    const Model = sequelize.define(
        "model",
        {
            idModel: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
            },
            codigo: {
                type: Sequelize.STRING,
            },
            fileAR: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.DECIMAL,
            },
            description: {
                type: Sequelize.STRING,
            },
            file2D: {
                type: Sequelize.STRING,
            },
            color: {
                type: Sequelize.STRING,
            },
            medidas: {
                type: Sequelize.STRING,
            },
            Provider_idProvider: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, freezeTableName: true }
    );

    return Model;
}

module.exports = init;
