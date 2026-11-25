const express = require('express')
const router = express.Router()
const {
  login,
  register,
  getMe,
  updatePassword,
  sendPasswordOtp,
  resetPasswordWithOtp,
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter')

/**
 * Authentication Routes — /api/auth
 */

// Public Endpoints (Protected by sliding-window rate limiters)
router.post('/login', loginLimiter, login)
router.post('/register', registerLimiter, register)

// Authenticated Endpoints
router.get('/me', protect, getMe)
router.post('/update-password', protect, updatePassword)
router.post('/send-password-otp', protect, sendPasswordOtp)
router.post('/reset-password-otp', protect, resetPasswordWithOtp)

module.exports = router
