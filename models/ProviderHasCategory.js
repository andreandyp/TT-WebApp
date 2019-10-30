function init(sequelize, Sequelize) {
    const ProviderHasCategory = sequelize.define(
        "provider_has_category",
        {
            idProviderCategory: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Provider_idProvider: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Category_idCategory: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return ProviderHasCategory;
}

module.exports = init;
