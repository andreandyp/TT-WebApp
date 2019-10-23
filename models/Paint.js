function init(sequelize, Sequelize) {
    const Paint = sequelize.define(
        "paint",
        {
            idPaint: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
            },
            vendorCode: {
                type: Sequelize.STRING,
            },
            rgbCode: {
                type: Sequelize.STRING,
            },
            Provider_idProvider: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return Paint;
}

module.exports = init;
