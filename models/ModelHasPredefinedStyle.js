function init(sequelize, Sequelize) {
    const ModelHasPredefinedStyle = sequelize.define(
        "model_has_predefinedstyle",
        {
            idModelPredefinedStyle: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Model_idModel: {
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

    return ModelHasPredefinedStyle;
}

module.exports = init;
