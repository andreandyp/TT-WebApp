function init(sequelize, Sequelize) {
    const Category = sequelize.define(
        "category",
        {
            idCategory: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            category: {
                type: Sequelize.STRING,
            },
        },
        { sequelize, timestamps: false, freezeTableName: true }
    );

    return Category;
}

module.exports = init;
