const mongoose = require('mongoose')

/**
 * Room Schema — Resort Inventory & Real-Time Operational State
 * 
 * Embeds live cleaning tasks and maintenance flags directly onto the room document.
 * This allows Housekeeping and Front Desk to inspect and update room readiness in
 * a single atomic MongoDB query, avoiding bloated multi-table relational joins.
 */
const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide a room number'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide suite name'],
      trim: true,
    },
    tier: {
      type: String,
      required: [true, 'Please provide suite tier'],
      uppercase: true,
      trim: true,
    },
    roomType: {
      type: String,
      enum: ['penthouse', 'villa', 'suite', 'deluxe'],
      default: 'suite',
      index: true,
    },
    floor: {
      type: Number,
      default: 1,
    },
    dimensions: {
      type: String,
      default: '150 m²',
    },
    baseNightlyRate: {
      type: Number,
      required: [true, 'Please provide nightly rate in PKR'],
      min: [0, 'Nightly rate cannot be negative'],
    },
    capacity: {
      adults: { type: Number, default: 2, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['AVAILABLE', 'OCCUPIED', 'DIRTY', 'CLEANING', 'INSPECTED', 'MAINTENANCE'],
        message: '{VALUE} is not a valid room status',
      },
      default: 'AVAILABLE',
      index: true,
    },

    // In-Residence Credentials for /my-stay Guest OS
    credentials: {
      wifiNetwork: { type: String, default: 'Stayza_Guest' },
      wifiPassword: { type: String, default: 'pacific2026' },
    },
    valetBay: {
      type: String,
      default: 'Bay #301 (Subterranean Lift)',
    },
    assignedButler: {
      type: String,
      default: 'Tariq J.',
    },

    // Live Housekeeping Task Checklist (Used on /housekeeping)
    cleaningTasks: {
      linen: { type: Boolean, default: true },
      bathSalts: { type: Boolean, default: true },
      minibar: { type: Boolean, default: true },
      inspection: { type: Boolean, default: true },
    },
    assignedCleaner: {
      type: String,
      default: 'Bilal Farooq',
    },

    // Embedded Maintenance Ticket (Instant Engineering Flag)
    maintenance: {
      isReported: { type: Boolean, default: false },
      issue: { type: String, default: '' },
      category: {
        type: String,
        enum: ['PLUMBING', 'ELECTRICAL', 'HVAC', 'CARPENTRY', 'ELECTRONICS', 'NONE'],
        default: 'NONE',
      },
      priority: {
        type: String,
        enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
        default: 'NORMAL',
      },
      reportedAt: { type: Date, default: null },
      status: {
        type: String,
        enum: ['REPORTED', 'IN_PROGRESS', 'RESOLVED'],
        default: 'RESOLVED',
      },
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound Index for fast date/type availability queries
roomSchema.index({ roomType: 1, status: 1 })

module.exports = mongoose.model('Room', roomSchema)
