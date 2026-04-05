const { sequelize } = require('../database/connection')
const Order     = require('../models/orderModel')
const OrderItem = require('../models/orderItemModel')
const Cart      = require('../models/cartModel')
const Product   = require('../models/productModel')
const ProductImage = require('../models/productImageModel')
const Coupon    = require('../models/couponModel')

const DELIVERY_CHARGES = {
    standard: 0,
    express:  5.55,
    next_day: 15.55,
}

const TAX_RATE = 6.5

// POST /api/orders
// body: { first_name, last_name, email, phone, address, city, state, zip_code,
//         delivery_option, payment_method, coupon_code? }
const placeOrder = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const user_id = req.user.id
        const {
            first_name, last_name, email, phone,
            address, city, state, zip_code,
            delivery_option = 'standard',
            payment_method,
            coupon_code,
        } = req.body

        // Validate required fields
        if (!first_name || !last_name || !email || !phone || !address || !city || !state || !zip_code) {
            await t.rollback()
            return res.status(400).json({ message: 'All shipping fields are required' })
        }
        if (!payment_method) {
            await t.rollback()
            return res.status(400).json({ message: 'payment_method is required' })
        }
        if (!DELIVERY_CHARGES.hasOwnProperty(delivery_option)) {
            await t.rollback()
            return res.status(400).json({ message: 'Invalid delivery_option. Use: standard, express, next_day' })
        }

        // Fetch cart items
        const cartItems = await Cart.findAll({
            where: { user_id },
            include: [{ model: Product, as: 'product' }],
        })
        if (!cartItems.length) {
            await t.rollback()
            return res.status(400).json({ message: 'Cart is empty' })
        }

        // Calculate subtotal
        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (Number(item.product.price) * item.quantity)
        }, 0)

        // Apply coupon
        let discount_amount = 0
        let applied_coupon = null
        if (coupon_code) {
            const coupon = await Coupon.findOne({ where: { code: coupon_code, is_active: true } })
            if (!coupon) {
                await t.rollback()
                return res.status(400).json({ message: 'Invalid or expired coupon code' })
            }
            if (subtotal < Number(coupon.min_order_amount)) {
                await t.rollback()
                return res.status(400).json({
                    message: `Minimum order amount of ₹${coupon.min_order_amount} required for this coupon`,
                })
            }
            if (coupon.discount_type === 'percentage') {
                discount_amount = (subtotal * Number(coupon.discount_value)) / 100
            } else {
                discount_amount = Number(coupon.discount_value)
            }
            applied_coupon = coupon_code
        }

        const delivery_charge = DELIVERY_CHARGES[delivery_option]
        const tax_amount      = (subtotal * TAX_RATE) / 100
        const total           = subtotal + tax_amount + delivery_charge - discount_amount

        // Create order
        const order = await Order.create({
            user_id,
            first_name, last_name, email, phone,
            address, city, state, zip_code,
            delivery_option,
            delivery_charge,
            payment_method,
            subtotal: subtotal.toFixed(2),
            tax_rate: TAX_RATE,
            tax_amount: tax_amount.toFixed(2),
            coupon_code: applied_coupon,
            discount_amount: discount_amount.toFixed(2),
            total: total.toFixed(2),
        }, { transaction: t })

        // Create order items
        const orderItems = cartItems.map(item => ({
            order_id:   order.id,
            product_id: item.product_id,
            quantity:   item.quantity,
            price:      item.product.price,
            color:      item.color,
            size:       item.size,
        }))
        await OrderItem.bulkCreate(orderItems, { transaction: t })

        // Clear cart
        await Cart.destroy({ where: { user_id }, transaction: t })

        await t.commit()
        res.status(201).json({ message: 'Order placed successfully', order })
    } catch (error) {
        await t.rollback()
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/orders
const getOrders = async (req, res) => {
    try {
        const user_id = req.user.id

        const orders = await Order.findAll({
            where: { user_id },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price'],
                    include: [{ model: ProductImage, as: 'images' }],
                }],
            }],
            order: [['createdAt', 'DESC']],
        })

        res.status(200).json({ orders })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/orders/:id
const getOrderById = async (req, res) => {
    try {
        const user_id = req.user.id
        const { id } = req.params

        const order = await Order.findOne({
            where: { id, user_id },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price'],
                    include: [{ model: ProductImage, as: 'images' }],
                }],
            }],
        })

        if (!order) {
            return res.status(404).json({ message: `Order with id ${id} not found` })
        }

        res.status(200).json({ order })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// POST /api/orders/validate-coupon
// body: { coupon_code, subtotal }
const validateCoupon = async (req, res) => {
    try {
        const { coupon_code, subtotal } = req.body

        if (!coupon_code) {
            return res.status(400).json({ message: 'coupon_code is required' })
        }

        const coupon = await Coupon.findOne({ where: { code: coupon_code, is_active: true } })
        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or expired coupon code' })
        }

        if (subtotal && subtotal < Number(coupon.min_order_amount)) {
            return res.status(400).json({
                message: `Minimum order amount of ₹${coupon.min_order_amount} required`,
            })
        }

        let discount_amount = 0
        if (coupon.discount_type === 'percentage') {
            discount_amount = (Number(subtotal || 0) * Number(coupon.discount_value)) / 100
        } else {
            discount_amount = Number(coupon.discount_value)
        }

        res.status(200).json({
            message: 'Coupon applied',
            discount_type:   coupon.discount_type,
            discount_value:  coupon.discount_value,
            discount_amount: discount_amount.toFixed(2),
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { placeOrder, getOrders, getOrderById, validateCoupon }
