const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

const register = async (req, res) => {
    try {
        console.log("body", req.body)
        const { first_name, last_name, email, password } = req.body

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: 'first_name, last_name, email and password are required' })
        }

        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ first_name, last_name, email, password: hashedPassword })

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email },
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required' })
        }

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email },
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { register, login }
