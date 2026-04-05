const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/connection')

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // Shipping info
    first_name:  { type: DataTypes.STRING, allowNull: false },
    last_name:   { type: DataTypes.STRING, allowNull: false },
    email:       { type: DataTypes.STRING, allowNull: false },
    phone:       { type: DataTypes.STRING, allowNull: false },
    address:     { type: DataTypes.STRING, allowNull: false },
    city:        { type: DataTypes.STRING, allowNull: false },
    state:       { type: DataTypes.STRING, allowNull: false },
    zip_code:    { type: DataTypes.STRING, allowNull: false },

    // Delivery
    delivery_option: {
        type: DataTypes.ENUM('standard', 'express', 'next_day'),
        allowNull: false,
        defaultValue: 'standard',
    },
    delivery_charge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },

    // Payment
    payment_method: {
        type: DataTypes.ENUM('credit_card', 'debit_card', 'google_pay', 'cod'),
        allowNull: false,
    },

    // Pricing
    subtotal:        { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    tax_rate:        { type: DataTypes.DECIMAL(5, 2),  defaultValue: 6.5 },
    tax_amount:      { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    coupon_code:     { type: DataTypes.STRING,          allowNull: true },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total:           { type: DataTypes.DECIMAL(10, 2), allowNull: false },

    // Status
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
    },
})

module.exports = Order
