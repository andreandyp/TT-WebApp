function init(sequelize, Sequelize) {
    return sequelize.define(
        "administrator",
        {
            idAdministrator: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );
}

module.exports = init;
