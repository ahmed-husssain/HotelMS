const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'luxurystay_dev_jwt_secret_2026')

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
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET must be defined in production environment.')
    }

    // 3. Cryptographically verify signature and expiration
    const decoded = jwt.verify(token, JWT_SECRET)

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

/**
 * Verify Booking Ownership Middleware
 * 
 * Verifies that the authenticated user (req.user) is either:
 * 1. The guest who owns the booking (by user ID or email)
 * 2. An authorized staff member ('receptionist', 'housekeeping', 'admin')
 * 
 * Rejects unauthorized callers with HTTP 403 Forbidden.
 */
async function verifyBookingOwnerOrStaff(req, res, next) {
  try {
    const reference = req.params.reference || req.body.bookingRef || req.query.ref
    if (!reference) {
      return res.status(400).json({ success: false, message: 'Reservation reference is required.' })
    }

    const Booking = require('../models/Booking')
    const booking = await Booking.findOne({ bookingReference: reference })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' })
    }

    // Staff tiers always have authorized access
    if (req.user && ['admin', 'receptionist', 'housekeeping'].includes(req.user.role)) {
      req.booking = booking
      return next()
    }

    // Guest tier: must match guest user ID or email
    const isOwnerId = booking.guest && req.user._id && booking.guest.toString() === req.user._id.toString()
    const isOwnerEmail = booking.guestDetails?.email && req.user.email &&
      booking.guestDetails.email.toLowerCase() === req.user.email.toLowerCase()

    if (!isOwnerId && !isOwnerEmail) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have authorization to control this reservation.',
      })
    }

    req.booking = booking
    next()
  } catch (error) {
    console.error('[verifyBookingOwnerOrStaff] Error:', error.message)
    res.status(500).json({ success: false, message: 'Authorization check failed.' })
  }
}

module.exports = { protect, verifyBookingOwnerOrStaff }
