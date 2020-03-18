const { Sequelize } = require('sequelize');

//db connection config
const sequelize = new Sequelize('nodedb', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'/*'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

module.exports = sequelize;