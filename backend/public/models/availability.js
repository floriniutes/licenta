module.exports = function (sequelize, DataTypes) {
    return sequelize.define('availability', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        consultationDay: DataTypes.INTEGER,
        consultationDuration: DataTypes.INTEGER,
        startTime: DataTypes.STRING,
        endTime: DataTypes.STRING
    })
};