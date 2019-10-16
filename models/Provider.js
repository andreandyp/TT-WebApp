function init(sequelize, Sequelize) {
    const Provider = sequelize.define(
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
            rfc: {
                type: Sequelize.STRING,
            },
            razonSocial: {
                type: Sequelize.STRING,
            },
            direccion: {
                type: Sequelize.STRING,
            },
            tipo: {
                type: Sequelize.STRING,
            },
            persona: {
                type: Sequelize.STRING,
            },
            categoria: {
                type: Sequelize.STRING,
            },
            Administrator_idAdministrator: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return Provider;
}

module.exports = init;
