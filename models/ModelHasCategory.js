function init(sequelize, Sequelize) {
    const ModelHasCategory = sequelize.define(
        "model_has_category",
        {
            idModelCategory: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Model_idModel: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Category_idCategory: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return ModelHasCategory;
}

module.exports = init;
