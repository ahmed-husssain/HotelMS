const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ActivityLog = require('../models/ActivityLog')

/**
 * Helper: Generate signed 7-day JSON Web Token
 */
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'luxurystay_dev_jwt_secret_2026',
    { expiresIn: '7d' }
  )
}

/**
 * @desc    Authenticate user & return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
async function login(req, res) {
  try {
    const { email, password } = req.body

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      })
    }

    const cleanEmail = email.toLowerCase().trim()

    // 2. Fetch user explicitly selecting the password hash
    const user = await User.findOne({ email: cleanEmail }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // 3. Verify bcrypt password hash
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // 4. Verify account active state
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact management.',
      })
    }

    // 5. Generate signed JWT token
    const token = generateToken(user)

    // 6. Log successful authentication in ActivityLog
    try {
      await ActivityLog.create({
        userId: user._id,
        action: 'USER_LOGIN',
        targetId: user._id.toString(),
        notes: `User ${user.email} (${user.role}) authenticated successfully.`,
      })
    } catch (logErr) {
      console.warn('[Auth] Non-fatal audit log warning:', logErr.message)
    }

    // 7. Return sanitized user profile + token
    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          activeReservationCode: user.activeReservationCode || '',
        },
      },
    })
  } catch (error) {
    console.error('[AuthController.login] Error:', error.message)
    res.status(500).json({
      success: false,
      message: 'Authentication failed due to internal server error.',
    })
  }
}

/**
 * @desc    Register a new guest account
 * @route   POST /api/auth/register
 * @access  Public (Role strictly forced to 'guest')
 */
async function register(req, res) {
  try {
    const { name, email, password, phone } = req.body

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      })
    }

    const cleanEmail = email.toLowerCase().trim()

    // 2. Prevent duplicate registrations
    const existingUser = await User.findOne({ email: cleanEmail })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      })
    }

    // 3. Strict Privilege Escalation Defense (AGENTS.md Rule 7)
    // Public registration strictly forces role: 'guest'.
    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password, // Automatically hashed by User.js pre-save hook
      role: 'guest',
      phone: phone || '',
    })

    // 4. Generate JWT token
    const token = generateToken(newUser)

    res.status(201).json({
      success: true,
      message: 'Guest account registered successfully.',
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
        },
      },
    })
  } catch (error) {
    console.error('[AuthController.register] Error:', error.message)
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed.',
    })
  }
}

/**
 * @desc    Fetch authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (Any authenticated role)
 */
async function getMe(req, res) {
  try {
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        activeReservationCode: req.user.activeReservationCode || '',
      },
    })
  } catch (error) {
    console.error('[AuthController.getMe] Error:', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    })
  }
}

module.exports = {
  login,
  register,
  getMe,
}
