function init(sequelize, Sequelize) {
    const PredefinedStyle = sequelize.define(
        "predefinedstyle",
        {
            idPredefinedStyle: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            style: {
                type: Sequelize.STRING,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return PredefinedStyle;
}

module.exports = init;
