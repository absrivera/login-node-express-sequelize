const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
class User extends Model { }

//db model
User.init({
    password: DataTypes.CHAR, 
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING
}, { sequelize, modelName: 'user' });

module.exports = User;