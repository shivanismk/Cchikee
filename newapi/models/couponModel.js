const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/connection')

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // 'percentage' or 'flat'
    discount_type: {
        type: DataTypes.ENUM('percentage', 'flat'),
        allowNull: false,
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    min_order_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
})

module.exports = Coupon
