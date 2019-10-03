module.exports = function(sequelize, DataTypes) {
    return sequelize.define('sections', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING
    })
};