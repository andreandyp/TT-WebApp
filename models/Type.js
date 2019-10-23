function init(sequelize, Sequelize) {
    const Type = sequelize.define(
        "type",
        {
            idType: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nameType: {
                type: Sequelize.STRING,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return Type;
}

module.exports = init;
