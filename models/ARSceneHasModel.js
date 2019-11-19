function init(sequelize, Sequelize) {
    const ARSceneHasModel = sequelize.define(
        "arscene_has_model",
        {
            idARSceneModel: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            ARScene_idARScene: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Model_idModel: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return ARSceneHasModel;
}

module.exports = init;
