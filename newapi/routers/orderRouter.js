const express = require('express')
const router = express.Router()
const { placeOrder, getOrders, getOrderById, validateCoupon } = require('../controllers/orderController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.post('/validate-coupon', verifyToken, validateCoupon)
router.post('/',                verifyToken, placeOrder)
router.get('/',                 verifyToken, getOrders)
router.get('/:id',              verifyToken, getOrderById)

module.exports = router
