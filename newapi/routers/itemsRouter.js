const express = require('express')
const router = express.Router()
const { createItem } = require('../controllers/itemsController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.post('/', verifyToken, createItem)

module.exports = router
