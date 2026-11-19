const express = require('express')
const router = express.Router()
const { login, register, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

/**
 * Authentication Routes — /api/auth
 */

// Public Endpoints
router.post('/login', login)
router.post('/register', register)

// Authenticated Endpoints
router.get('/me', protect, getMe)

module.exports = router
