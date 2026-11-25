const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ActivityLog = require('../models/ActivityLog')
const { sendPasswordResetOtpEmail } = require('../services/emailService')

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'luxurystay_dev_jwt_secret_2026')

/**
 * Helper: Generate signed 7-day JSON Web Token
 */
function generateToken(user) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in production environment.')
  }
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
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
        actorName: user.name || 'User',
        action: 'USER_LOGIN',
        category: 'SECURITY',
        targetModel: 'User',
        targetId: user._id.toString(),
        details: `User ${user.email} (${user.role}) authenticated successfully.`,
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

/**
 * @desc    Update password (when user knows their current password)
 * @route   POST /api/auth/update-password
 * @access  Private (Authenticated)
 */
async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords.',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      })
    }

    const user = await User.findById(req.user._id).select('+password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      })
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'The current password you entered is incorrect.',
      })
    }

    // Update password (pre-save hook hashes it automatically)
    user.password = newPassword
    await user.save()

    // Audit log
    try {
      await ActivityLog.create({
        userId: user._id,
        actorName: user.name || 'User',
        action: 'USER_PASSWORD_CHANGE',
        category: 'SECURITY',
        targetModel: 'User',
        targetId: user._id.toString(),
        details: `User ${user.email} successfully updated their password.`,
      })
    } catch (logErr) {
      console.warn('[Auth] Non-fatal audit log warning:', logErr.message)
    }

    res.status(200).json({
      success: true,
      message: 'Your password has been updated successfully.',
    })
  } catch (error) {
    console.error('[AuthController.updatePassword] Error:', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to update password. Please try again.',
    })
  }
}

/**
 * @desc    Send 6-digit OTP code to user's registered email for password reset
 * @route   POST /api/auth/send-password-otp
 * @access  Private (Authenticated)
 */
async function sendPasswordOtp(req, res) {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      })
    }

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    user.resetPasswordOtp = otp
    user.resetPasswordExpires = expiresAt
    await user.save()

    // Dispatch OTP email via emailService
    const emailResult = await sendPasswordResetOtpEmail({
      email: user.email,
      name: user.name,
      otp,
    })

    // Audit log
    try {
      await ActivityLog.create({
        userId: user._id,
        actorName: user.name || 'User',
        action: 'USER_REQUEST_PASSWORD_OTP',
        category: 'SECURITY',
        targetModel: 'User',
        targetId: user._id.toString(),
        details: `Password reset OTP dispatched to ${user.email}.`,
      })
    } catch (logErr) {
      console.warn('[Auth] Non-fatal audit log warning:', logErr.message)
    }

    res.status(200).json({
      success: true,
      message: `Verification code sent to ${user.email}. Valid for 10 minutes.`,
      data: {
        email: user.email,
        expiresInSeconds: 600,
        // In local/demo mode, provide OTP in payload for easy evaluation
        demoOtp: process.env.NODE_ENV !== 'production' || emailResult.simulated ? otp : undefined,
      },
    })
  } catch (error) {
    console.error('[AuthController.sendPasswordOtp] Error:', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code. Please try again.',
    })
  }
}

/**
 * @desc    Verify OTP and reset password (when user forgot current password)
 * @route   POST /api/auth/reset-password-otp
 * @access  Private (Authenticated)
 */
async function resetPasswordWithOtp(req, res) {
  try {
    const { otp, newPassword } = req.body

    if (!otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both the 6-digit verification code and new password.',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      })
    }

    const user = await User.findById(req.user._id).select('+password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      })
    }

    // Verify OTP exists and hasn't expired
    if (!user.resetPasswordOtp || !user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: 'No verification code was requested, or it has expired. Please request a new code.',
      })
    }

    if (new Date() > new Date(user.resetPasswordExpires)) {
      user.resetPasswordOtp = null
      user.resetPasswordExpires = null
      await user.save()
      return res.status(400).json({
        success: false,
        message: 'The verification code has expired. Please request a new one.',
      })
    }

    // Check code match
    if (user.resetPasswordOtp.trim() !== otp.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your email and try again.',
      })
    }

    // Code is valid: update password and clear OTP fields
    user.password = newPassword
    user.resetPasswordOtp = null
    user.resetPasswordExpires = null
    await user.save()

    // Audit log
    try {
      await ActivityLog.create({
        userId: user._id,
        actorName: user.name || 'User',
        action: 'USER_PASSWORD_RESET_OTP',
        category: 'SECURITY',
        targetModel: 'User',
        targetId: user._id.toString(),
        details: `User ${user.email} successfully reset their password via email OTP verification.`,
      })
    } catch (logErr) {
      console.warn('[Auth] Non-fatal audit log warning:', logErr.message)
    }

    res.status(200).json({
      success: true,
      message: 'Your password has been reset successfully.',
    })
  } catch (error) {
    console.error('[AuthController.resetPasswordWithOtp] Error:', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to reset password. Please try again.',
    })
  }
}

module.exports = {
  login,
  register,
  getMe,
  updatePassword,
  sendPasswordOtp,
  resetPasswordWithOtp,
}
