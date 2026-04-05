const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const ProductImage = require('../models/productImageModel')

// POST /api/cart
// body: { product_id, quantity, color, size }
const addToCart = async (req, res) => {
    try {
        const user_id = req.user.id
        const { product_id, quantity = 1, color, size } = req.body

        if (!product_id) {
            return res.status(400).json({ message: 'product_id is required' })
        }

        const product = await Product.findByPk(product_id)
        if (!product || !product.is_active) {
            return res.status(404).json({ message: `Product with id ${product_id} not found` })
        }

        // if same product+color+size already in cart → update quantity
        const existing = await Cart.findOne({ where: { user_id, product_id, color: color || null, size: size || null } })

        if (existing) {
            existing.quantity += Number(quantity)
            await existing.save()
            return res.status(200).json({ message: 'Cart updated', cart: existing })
        }

        const cart = await Cart.create({ user_id, product_id, quantity, color, size })
        res.status(201).json({ message: 'Product added to cart', cart })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/cart
const getCart = async (req, res) => {
    try {
        const user_id = req.user.id

        const items = await Cart.findAll({
            where: { user_id },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'stock'],
                include: [{ model: ProductImage, as: 'images' }],
            }],
            order: [['createdAt', 'DESC']],
        })

        const total = items.reduce((sum, item) => {
            return sum + (Number(item.product.price) * item.quantity)
        }, 0)

        res.status(200).json({ items, total: total.toFixed(2) })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// PUT /api/cart/:id
// body: { quantity }
const updateCartItem = async (req, res) => {
    try {
        const user_id = req.user.id
        const { id } = req.params
        const { quantity } = req.body

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'quantity must be at least 1' })
        }

        const item = await Cart.findOne({ where: { id, user_id } })
        if (!item) {
            return res.status(404).json({ message: `Cart item with id ${id} not found` })
        }

        await item.update({ quantity })
        res.status(200).json({ message: 'Cart item updated', cart: item })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// DELETE /api/cart/:id
const removeCartItem = async (req, res) => {
    try {
        const user_id = req.user.id
        const { id } = req.params

        const item = await Cart.findOne({ where: { id, user_id } })
        if (!item) {
            return res.status(404).json({ message: `Cart item with id ${id} not found` })
        }

        await item.destroy()
        res.status(200).json({ message: 'Item removed from cart' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// DELETE /api/cart
const clearCart = async (req, res) => {
    try {
        const user_id = req.user.id
        await Cart.destroy({ where: { user_id } })
        res.status(200).json({ message: 'Cart cleared' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { addToCart, getCart, updateCartItem, removeCartItem, clearCart }
