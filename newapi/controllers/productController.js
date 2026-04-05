const Product = require('../models/productModel')
const ProductImage = require('../models/productImageModel')
const Category = require('../models/categoryModel')

// GET /api/products
const getAllProducts = async (_req, res) => {
    try {
        const products = await Product.findAll({
            where: { is_active: true },
            include: [{ model: ProductImage, as: 'images' }],
            order: [['createdAt', 'DESC']],
        })
        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findOne({
            where: { id, is_active: true },
            include: [{ model: ProductImage, as: 'images' }],
        })
        if (!product) {
            return res.status(404).json({ message: `Product with id ${id} not found` })
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/products/new-arrivals
const getNewArrivals = async (_req, res) => {
    try {
        const products = await Product.findAll({
            where: { is_new_arrival: true, is_active: true },
            attributes: ['id', 'name', 'price', 'description', 'stock', 'is_new_arrival', 'is_trending', 'is_active', 'createdAt'],
            include: [
                { model: ProductImage, as: 'images' },
                { model: Category, as: 'levelOneCategory', attributes: ['id', 'name'] },
                { model: Category, as: 'levelTwoCategory', attributes: ['id', 'name'] },
                { model: Category, as: 'category',         attributes: ['id', 'name'] },
            ],
            order: [['createdAt', 'DESC']],
        })
        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET /api/products/trending
const getTrendingProducts = async (req, res) => {
    try {
        const { level_one_category } = req.query

        if (!level_one_category) {
            return res.status(400).json({ message: 'level_one_category is required as a query parameter' })
        }

        const products = await Product.findAll({
            where: { is_trending: true, is_active: true, level_one_category },
            attributes: ['id', 'name', 'price', 'description', 'stock', 'is_new_arrival', 'is_trending', 'is_active', 'createdAt'],
            include: [
                { model: ProductImage, as: 'images' },
                { model: Category, as: 'levelOneCategory', attributes: ['id', 'name'] },
                { model: Category, as: 'levelTwoCategory', attributes: ['id', 'name'] },
                { model: Category, as: 'category',         attributes: ['id', 'name'] },
            ],
            order: [['createdAt', 'DESC']],
        })
        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// POST /api/products  (multipart/form-data)
// fields : name, price, description, stock, category, is_active
// files  : images (multiple)  — first uploaded file becomes primary
const createProduct = async (req, res) => {
    try {
        const { name, price, description, stock, level_one_category, level_two_category, category_id, is_active, is_new_arrival, is_trending } = req.body

        if (!name || price === undefined || price === null) {
            return res.status(400).json({ message: 'name and price are required' })
        }

        const product = await Product.create({ name, price, description, stock, level_one_category, level_two_category, category_id, is_active, is_new_arrival, is_trending })

        if (req.files && req.files.length > 0) {
            const imageRecords = req.files.map((file, idx) => ({
                product_id: product.id,
                image_url: file.path.replace(/\\/g, '/'),   // normalize path for all OS
                is_primary: idx === 0,                       // first image is primary
            }))
            await ProductImage.bulkCreate(imageRecords)
        }

        const result = await Product.findByPk(product.id, {
            include: [{ model: ProductImage, as: 'images' }],
        })

        res.status(201).json({ message: 'Product created successfully', product: result })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// POST /api/products/bulk
// body: array of products, each can have an "images" array
// [{ name, price, stock, category, images: [{ image_url, is_primary }, ...] }]
const bulkInsertProducts = async (req, res) => {
    try {
        const products = req.body

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Request body must be a non-empty array of products' })
        }

        for (let i = 0; i < products.length; i++) {
            const { name, price } = products[i]
            if (!name || price === undefined || price === null) {
                return res.status(400).json({
                    message: `Product at index ${i} is missing required fields: name, price`,
                })
            }
        }

        const result = []

        for (const productData of products) {
            const { images = [], ...productFields } = productData

            const product = await Product.create(productFields)

            if (images.length > 0) {
                // ensure at least one image is marked primary
                const hasPrimary = images.some(img => img.is_primary)
                const imageRecords = images.map((img, idx) => ({
                    product_id: product.id,
                    image_url: img.image_url,
                    is_primary: hasPrimary ? !!img.is_primary : idx === 0,
                }))
                await ProductImage.bulkCreate(imageRecords)
            }

            const productWithImages = await Product.findByPk(product.id, {
                include: [{ model: ProductImage, as: 'images' }],
            })
            result.push(productWithImages)
        }

        res.status(201).json({
            message: `${result.length} products inserted successfully`,
            products: result,
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// PUT /api/products/:id
// optionally pass "images" array to replace all images for that product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { images, ...productFields } = req.body

        const product = await Product.findByPk(id)
        if (!product) {
            return res.status(404).json({ message: `Product with id ${id} not found` })
        }

        await product.update(productFields)

        if (images && Array.isArray(images)) {
            // replace existing images
            await ProductImage.destroy({ where: { product_id: id } })
            if (images.length > 0) {
                const hasPrimary = images.some(img => img.is_primary)
                const imageRecords = images.map((img, idx) => ({
                    product_id: id,
                    image_url: img.image_url,
                    is_primary: hasPrimary ? !!img.is_primary : idx === 0,
                }))
                await ProductImage.bulkCreate(imageRecords)
            }
        }

        const updated = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: 'images' }],
        })

        res.status(200).json({ message: 'Product updated successfully', product: updated })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// DELETE /api/products/:id  — images are deleted via CASCADE
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)
        if (!product) {
            return res.status(404).json({ message: `Product with id ${id} not found` })
        }
        await product.destroy()
        res.status(200).json({ message: `Product with id ${id} deleted successfully` })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { getAllProducts, getProductById, getNewArrivals, getTrendingProducts, createProduct, bulkInsertProducts, updateProduct, deleteProduct }
