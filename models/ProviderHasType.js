function init(sequelize, Sequelize) {
    const ProviderHasType = sequelize.define(
        "provider_has_type",
        {
            idProviderType: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Provider_idProvider: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Type_idType: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return ProviderHasType;
}

module.exports = init;
