const Items = require('../models/itemsModel')

const createItem = async (req, res) => {
    try {
        const { user_id, title, description, isCompleted, priority, dueDate } = req.body

        if (!user_id || !title) {
            return res.status(400).json({ message: 'user_id and title are required' })
        }

        const item = await Items.create({ user_id, title, description, isCompleted, priority, dueDate })

        res.status(201).json({ message: 'Item created successfully', item })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { createItem }
