function init(sequelize, Sequelize) {
    const Administrator = sequelize.define(
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

    return Administrator;
}

module.exports = init;
