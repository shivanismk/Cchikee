const express = require('express')
const router = express.Router()
const { getAllProducts, getProductById, getNewArrivals, getTrendingProducts, createProduct, bulkInsertProducts, updateProduct, deleteProduct } = require('../controllers/productController')
const { verifyToken } = require('../middlewares/authMiddleware')
const upload = require('../middlewares/uploadMiddleware')

router.get('/',              getAllProducts)
router.get('/new-arrivals', getNewArrivals)
router.get('/trending',     getTrendingProducts)
router.get('/:id',          getProductById)
router.post('/',      verifyToken, upload.array('images', 10), createProduct)
router.post('/bulk',  verifyToken, bulkInsertProducts)
router.put('/:id', verifyToken, updateProduct)
router.delete('/:id', verifyToken, deleteProduct)

module.exports = router
