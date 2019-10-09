function init(sequelize, Sequelize) {
    const SocialNetwork = sequelize.define(
        "socialnetwork",
        {
            idSocialNetwork: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            socialNetworkUrl: {
                type: Sequelize.STRING,
            },
            Provider_idProvider: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return SocialNetwork;
}

module.exports = init;
