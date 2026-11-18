const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

/**
 * User Schema — Stakeholder Identity & Role-Based Access Control
 * 
 * Supports all 4 system roles:
 * - guest: Accesses self-service booking, digital key, in-stay room service & folio (/my-stay)
 * - receptionist: Front desk operations, check-in/out, incidental posting, shift management (/pms)
 * - housekeeping: Room turnaround queue, cleaning checklists, maintenance logger (/housekeeping)
 * - admin: General Manager, inventory control, staff management, executive revenue analytics (/admin)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never send password hash in query responses
    },
    role: {
      type: String,
      enum: {
        values: ['guest', 'receptionist', 'housekeeping', 'admin'],
        message: '{VALUE} is not a valid user role',
      },
      default: 'guest',
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    activeReservationCode: {
      type: String,
      trim: true,
      default: '',
    },
    preferences: {
      pillowType: { type: String, default: 'Feather & Down' },
      dietaryNotes: { type: String, default: '' },
      climatePreference: { type: String, default: '21°C' },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

/**
 * Pre-Save Middleware: Automatically hash password with bcrypt (Cost: 10)
 * Only triggers if the password field was modified or created.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

/**
 * Instance Method: Compare candidate password with stored bcrypt hash
 * @param {string} candidatePassword - Plaintext password from login form
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
