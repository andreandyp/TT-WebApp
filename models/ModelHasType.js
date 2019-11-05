function init(sequelize, Sequelize) {
    const ModelHasType = sequelize.define(
        "model_has_type",
        {
            idModelType: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Model_idModel: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Type_idType: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return ModelHasType;
}

module.exports = init;
