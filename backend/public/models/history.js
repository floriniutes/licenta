module.exports = function(sequelize, DataTypes) {
    return sequelize.define('history', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        section: DataTypes.STRING,
        comments: DataTypes.STRING,
        date: DataTypes.DATEONLY
    })
};