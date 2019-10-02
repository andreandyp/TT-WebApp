function init(sequelize, Sequelize) {
    return sequelize.define(
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
            type: {
                type: Sequelize.STRING,
            },
            style: {
                type: Sequelize.STRING,
            },
            category: {
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
            Provider_idProvider: {
                type: Sequelize.INTEGER,
            },
            file2D: {
                type: Sequelize.STRING,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );
}

module.exports = init;
