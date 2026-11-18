const mongoose = require('mongoose')

/**
 * Booking Schema — The Entire Stay Lifecycle in One Document
 * 
 * Unifies:
 * 1. Reservation Dates & 5-Minute Pessimistic Checkout Hold (Doc FR-1.4)
 * 2. Immutable Zero-Trust Pricing Snapshot (Doc TRD 2.3)
 * 3. Embedded In-Stay Incidentals Folio for /my-stay (Dining, Spa, Concierge)
 * 4. In-Residence Controls (DND, Climate Mode, Digital Key access)
 * 5. Guest Experience Feedback & Rating (Doc FR-56)
 */
const incidentalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Dining', 'Spa', 'Housekeeping', 'Transport', 'Experience', 'Front Desk', 'General'],
      default: 'General',
    },
    time: { type: String, default: 'Just now' },
    addedBy: { type: String, default: 'In-House Guest' },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
)

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: [true, 'Please provide a booking reference'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for guest checkouts before account creation
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Booking must be assigned to a room'],
      index: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please specify check-in date'],
      index: true,
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please specify check-out date'],
      index: true,
    },
    numberOfNights: {
      type: Number,
      required: true,
      min: [1, 'Booking must be at least 1 night'],
    },
    guestDetails: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true, index: true },
      phone: { type: String, required: true, trim: true },
      specialRequests: { type: String, default: '' },
    },

    // Zero-Trust Pricing Snapshot (Frozen at reservation time)
    pricingSnapshot: {
      nightlyRate: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      taxPercent: { type: Number, default: 13 }, // 13% Sindh Sales Tax
      taxAmount: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
      advancePercent: { type: Number, default: 30 }, // 30% online deposit
      advanceAmount: { type: Number, required: true },
      advancePaid: { type: Number, default: 0 },
      balanceDue: { type: Number, required: true },
      currency: { type: String, default: 'PKR' },
    },

    status: {
      type: String,
      enum: {
        values: [
          'AWAITING_PAYMENT',
          'CONFIRMED',
          'CHECKED_IN',
          'CHECKOUT_REQUESTED',
          'CHECKED_OUT',
          'CANCELLED',
          'EXPIRED',
        ],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'AWAITING_PAYMENT',
      index: true,
    },

    // 5-Minute Pessimistic Lock Timer (Pessimistic Concurrency)
    holdExpiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    checkedOutAt: {
      type: Date,
      default: null,
    },

    // /my-stay In-Residence Settings
    inStaySettings: {
      isDND: { type: Boolean, default: false },
      climateMode: { type: String, enum: ['ocean', 'cedar'], default: 'ocean' },
    },
    digitalKeyAccess: {
      isUnlocked: { type: Boolean, default: false },
      lastUnlockedAt: { type: Date, default: null },
    },

    // In-Stay Incidentals Folio (In-Room Dining, Cedar Spa, Helipad transfers)
    incidentals: {
      type: [incidentalSchema],
      default: [],
    },

    // Guest Experience Feedback & Rating
    feedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: '' },
      tags: { type: [String], default: [] },
      submittedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
)

// Compound Index: Enforces atomic date overlap detection (Doc TRD 3.1)
bookingSchema.index({ room: 1, checkInDate: 1, checkOutDate: 1, status: 1 })

module.exports = mongoose.model('Booking', bookingSchema)
