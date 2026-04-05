const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/connection')

const Items = sequelize.define('Items',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        isCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        priority: {
            type: DataTypes.ENUM("low", "medium", "high"),
            defaultValue: "medium",
        },

        dueDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    },
)


module.exports = Items
