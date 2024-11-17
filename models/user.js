const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', { // Pastikan tidak ada spasi di sini
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = User;