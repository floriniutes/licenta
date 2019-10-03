module.exports = function (sequelize, DataTypes) {
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        token: DataTypes.STRING,
        pid: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        phoneNumber: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        isDoctor: DataTypes.BOOLEAN,
        isActive: DataTypes.BOOLEAN,
        isAssistant: DataTypes.BOOLEAN
    })
};