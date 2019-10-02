function init(sequelize, Sequelize) {
    return sequelize.define(
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
}

module.exports = init;
