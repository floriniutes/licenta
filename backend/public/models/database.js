const Sequelize = require('sequelize');
const config = require('../../config/config.json');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    logging: false,
    host: config.host,
    dialect: config.dialect,
    define: {
        timestamps: false
    }
});

module.exports = sequelize;