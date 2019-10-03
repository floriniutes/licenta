module.exports = function(sequelize, DataTypes) {
    return sequelize.define('consultations', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: DataTypes.DATEONLY,
        time: DataTypes.STRING,
        section: DataTypes.STRING,
        duration: DataTypes.INTEGER,
        completed: DataTypes.BOOLEAN,
        abandoned: DataTypes.BOOLEAN
    })
};