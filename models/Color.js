function init(sequelize, Sequelize) {
    const Color = sequelize.define(
        "color",
        {
            idColor: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
            },
            rgbCode: {
                type: Sequelize.STRING,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return Color;
}

module.exports = init;
