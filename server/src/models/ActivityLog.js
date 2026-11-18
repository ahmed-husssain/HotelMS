const mongoose = require('mongoose')

/**
 * ActivityLog Schema — Immutable System Audit Trail (Doc TRD 2.10)
 * 
 * Records critical hospitality operations:
 * - Guest Check-in & Key Issuance
 * - Folio Settlement & Balance Collection
 * - Manual Room Status Overrides & Turnovers
 * - Staff Account Mutations
 */
const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actorName: {
      type: String,
      default: 'System Operator',
      trim: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['RESERVATION', 'PMS_FRONT_DESK', 'HOUSEKEEPING', 'BILLING', 'MAINTENANCE', 'SECURITY', 'SYSTEM'],
      default: 'SYSTEM',
      index: true,
    },
    details: {
      type: String,
      required: true,
    },
    targetModel: {
      type: String,
      enum: ['Booking', 'Room', 'Payment', 'User', 'System'],
      default: 'System',
    },
    targetId: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ActivityLog', activityLogSchema)
