function init(sequelize, Sequelize) {
    return sequelize.define(
        "model_has_color",
        {
            idModelColor: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Model_idModel: {
                type: Sequelize.INTEGER,
            },
            Color_idColor: {
                type: Sequelize.INTEGER,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );
}

module.exports = init;
