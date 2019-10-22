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
            rfc: {
                type: Sequelize.STRING,
            },
            razonSocial: {
                type: Sequelize.STRING,
            },
            tipo: {
                type: Sequelize.ENUM(
                    "ILUMINACION",
                    "PISO",
                    "MUEBLES",
                    "PINTURA",
                    "DECORACION"
                ),
            },
            persona: {
                type: Sequelize.ENUM("FISICA", "MORAL"),
            },
            categoria: {
                type: Sequelize.ENUM("BAJO", "MEDIO", "ALTO"),
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
