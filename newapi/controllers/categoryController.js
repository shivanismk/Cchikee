const Category = require('../models/categoryModel')

// GET /api/categories
// returns flat list of all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { is_active: true },
            order: [['parent_id', 'ASC'], ['name', 'ASC']],
        })
        res.status(200).json({ categories })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/categories/tree
// returns full nested tree (parent → group → sub-items)
const getCategoryTree = async (req, res) => {
    try {
        const buildTree = async (parentId = null) => {
            const nodes = await Category.findAll({
                where: { parent_id: parentId === null ? null : parentId, is_active: true },
                order: [['name', 'ASC']],
            })
            const result = []
            for (const node of nodes) {
                const children = await buildTree(node.id)
                result.push({ ...node.toJSON(), subcategories: children })
            }
            return result
        }

        const tree = await buildTree(null)
        res.status(200).json({ categories: tree })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/categories/:id
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByPk(id, {
            include: [
                { model: Category, as: 'subcategories' },
                { model: Category, as: 'parent' },
            ],
        })
        if (!category) {
            return res.status(404).json({ message: `Category with id ${id} not found` })
        }
        res.status(200).json({ category })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/categories/:id/subcategories
const getSubcategories = async (req, res) => {
    try {
        const { id } = req.params
        const parent = await Category.findByPk(id)
        if (!parent) {
            return res.status(404).json({ message: `Category with id ${id} not found` })
        }
        const subcategories = await Category.findAll({
            where: { parent_id: id, is_active: true },
            order: [['name', 'ASC']],
        })
        res.status(200).json({ subcategories })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// POST /api/categories
const createCategory = async (req, res) => {
    try {
        const { name, parent_id, image_url, is_featured } = req.body
        if (!name) {
            return res.status(400).json({ message: 'name is required' })
        }

        // if parent_id given, verify it exists
        if (parent_id) {
            const parent = await Category.findByPk(parent_id)
            if (!parent) {
                return res.status(404).json({ message: `Parent category with id ${parent_id} not found` })
            }
        }

        const category = await Category.create({ name, parent_id: parent_id || null, image_url, is_featured })
        res.status(201).json({ message: 'Category created successfully', category })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// POST /api/categories/bulk
const bulkInsertCategories = async (req, res) => {
    try {
        const categories = req.body
        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ message: 'Request body must be a non-empty array of categories' })
        }
        for (let i = 0; i < categories.length; i++) {
            if (!categories[i].name) {
                return res.status(400).json({ message: `Category at index ${i} is missing required field: name` })
            }
        }
        const created = await Category.bulkCreate(categories, { validate: true })
        res.status(201).json({ message: `${created.length} categories inserted successfully`, categories: created })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const category = await Category.findByPk(id)
        if (!category) {
            return res.status(404).json({ message: `Category with id ${id} not found` })
        }

        // prevent a category from being its own parent
        if (updates.parent_id && Number(updates.parent_id) === Number(id)) {
            return res.status(400).json({ message: 'A category cannot be its own parent' })
        }

        await category.update(updates)
        res.status(200).json({ message: 'Category updated successfully', category })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByPk(id)
        if (!category) {
            return res.status(404).json({ message: `Category with id ${id} not found` })
        }
        await category.destroy()   // CASCADE will remove child categories
        res.status(200).json({ message: `Category with id ${id} deleted successfully` })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = {
    getAllCategories,
    getCategoryTree,
    getCategoryById,
    getSubcategories,
    createCategory,
    bulkInsertCategories,
    updateCategory,
    deleteCategory,
}
