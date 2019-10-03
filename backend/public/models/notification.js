module.exports = function (sequelize, DataTypes) {
    return sequelize.define('notifications', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text: DataTypes.STRING,
        additional: DataTypes.STRING,
        isNew: DataTypes.BOOLEAN,
        date: DataTypes.DATEONLY
    })
};