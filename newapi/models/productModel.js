const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/connection')

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    level_one_category: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    level_two_category: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    is_new_arrival: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_trending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
})

module.exports = Product
