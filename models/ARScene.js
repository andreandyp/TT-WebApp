function init(sequelize, Sequelize) {
    const ARScene = sequelize.define(
        "arscene",
        {
            idARScene: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
            },
            imagen: {
                type: Sequelize.STRING,
            },
            Provider_idProvider: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Type_idType: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            PredefinedStyle_idPredefinedStyle: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return ARScene;
}

module.exports = init;
