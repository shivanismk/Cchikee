const express = require('express')
const router = express.Router()
const { addToCart, getCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.post('/',      verifyToken, addToCart)
router.get('/',       verifyToken, getCart)
router.put('/:id',    verifyToken, updateCartItem)
router.delete('/',    verifyToken, clearCart)
router.delete('/:id', verifyToken, removeCartItem)

module.exports = router
