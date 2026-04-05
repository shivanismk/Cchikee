const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/connection')

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
})

// self-referencing associations
Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parent_id' })
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' })

module.exports = Category
