const express = require('express')
const router = express.Router()
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.post('/',      verifyToken, addToWishlist)
router.get('/',       verifyToken, getWishlist)
router.delete('/:id', verifyToken, removeFromWishlist)

module.exports = router
