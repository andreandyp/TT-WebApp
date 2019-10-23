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
                type: Sequelize.ENUM(
                    "MODERNO",
                    "BARROCO",
                    "MINIMALISTA",
                    "INDUSTRIAL",
                    "RUSTICO",
                    "CLASICO",
                    "VINTAGE",
                    "OTRO"
                ),
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return PredefinedStyle;
}

module.exports = init;
