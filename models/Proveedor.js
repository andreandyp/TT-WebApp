function init(sequelize, Sequelize) {
    return sequelize.define(
        "provider",
        {
            idProvider: {
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
            name: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            socialNetwork: {
                type: Sequelize.STRING,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );
}

module.exports = init;
