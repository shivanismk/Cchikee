const Wishlist = require('../models/wishlistModel')
const Product = require('../models/productModel')
const ProductImage = require('../models/productImageModel')

// POST /api/wishlist
// body: { product_id }
const addToWishlist = async (req, res) => {
    try {
        const user_id = req.user.id
        const { product_id } = req.body

        if (!product_id) {
            return res.status(400).json({ message: 'product_id is required' })
        }

        const product = await Product.findByPk(product_id)
        if (!product || !product.is_active) {
            return res.status(404).json({ message: `Product with id ${product_id} not found` })
        }

        const existing = await Wishlist.findOne({ where: { user_id, product_id } })
        if (existing) {
            return res.status(409).json({ message: 'Product already in wishlist' })
        }

        const item = await Wishlist.create({ user_id, product_id })
        res.status(201).json({ message: 'Product added to wishlist', wishlist: item })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/wishlist
const getWishlist = async (req, res) => {
    try {
        const user_id = req.user.id

        const items = await Wishlist.findAll({
            where: { user_id },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'stock'],
                include: [{ model: ProductImage, as: 'images' }],
            }],
            order: [['createdAt', 'DESC']],
        })

        res.status(200).json({ items })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// DELETE /api/wishlist/:id
const removeFromWishlist = async (req, res) => {
    try {
        const user_id = req.user.id
        const { id } = req.params

        const item = await Wishlist.findOne({ where: { id, user_id } })
        if (!item) {
            return res.status(404).json({ message: `Wishlist item with id ${id} not found` })
        }

        await item.destroy()
        res.status(200).json({ message: 'Item removed from wishlist' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { addToWishlist, getWishlist, removeFromWishlist }
