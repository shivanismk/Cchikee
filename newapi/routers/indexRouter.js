const express = require('express')
const router = express.Router()

router.use('/items', require('./itemsRouter'))
router.use('/users', require('./userRouter'))
router.use('/products',   require('./productRouter'))
router.use('/categories', require('./categoryRouter'))
router.use('/cart',       require('./cartRouter'))
router.use('/wishlist',   require('./wishlistRouter'))
router.use('/orders',     require('./orderRouter'))

module.exports = router