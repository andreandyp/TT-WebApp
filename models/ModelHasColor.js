function init(sequelize, Sequelize) {
    const ModelHasColor = sequelize.define(
        "model_has_color",
        {
            idModelColor: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Model_idModel: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Color_idColor: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return ModelHasColor;
}

module.exports = init;
