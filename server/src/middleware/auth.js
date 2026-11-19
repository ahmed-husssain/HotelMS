const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * Protect Middleware — Cryptographic JWT Authentication Gate
 * 
 * Extracts Bearer token from Authorization header, cryptographically verifies
 * the signature using JWT_SECRET, and attaches the authenticated user to req.user.
 * 
 * Rejects missing, tampered, or expired tokens with HTTP 401 Unauthorized.
 */
async function protect(req, res, next) {
  let token

  // 1. Extract Bearer token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  // 2. Reject if no token was provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid Bearer token.',
    })
  }

  try {
    // 3. Cryptographically verify signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luxurystay_dev_jwt_secret_2026')

    // 4. Retrieve fresh user from database (excluding password hash)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user account associated with this token no longer exists.',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This user account has been deactivated. Contact management.',
      })
    }

    // 5. Attach authenticated user to request pipeline
    req.user = user
    next()
  } catch (error) {
    console.warn('[Auth Middleware] Verification failed:', error.message)

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      })
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or forged authentication token.',
    })
  }
}

module.exports = { protect }
