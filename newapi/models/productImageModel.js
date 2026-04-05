const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/connection')

const ProductImage = sequelize.define('ProductImage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
})

module.exports = ProductImage
