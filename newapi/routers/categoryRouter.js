const express = require('express')
const router = express.Router()
const {
    getAllCategories,
    getCategoryTree,
    getCategoryById,
    getSubcategories,
    createCategory,
    bulkInsertCategories,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController')
const { verifyToken } = require('../middlewares/authMiddleware')

// public routes
router.get('/',              getAllCategories)
router.get('/tree',          getCategoryTree)
router.get('/:id',           getCategoryById)
router.get('/:id/subcategories', getSubcategories)

// protected routes (require JWT)
router.post('/bulk',  verifyToken, bulkInsertCategories)
router.post('/',      verifyToken, createCategory)
router.put('/:id',    verifyToken, updateCategory)
router.delete('/:id', verifyToken, deleteCategory)

module.exports = router
