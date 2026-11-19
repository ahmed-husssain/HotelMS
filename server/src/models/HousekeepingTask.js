const mongoose = require('mongoose')

/**
 * HousekeepingTask Schema — Room Turnovers & Cleaning Workflows (Doc TRD 2.7)
 * 
 * Tracks room cleaning operations and 4-point turnover standard:
 * - Linens: Fresh bed sheets & duvet
 * - Amenities: Soap, shampoo, water, tea/coffee, snacks restocked
 * - Bath/Bar: Restocked and sanitized
 * - Supervisor Certification: Ready for Front Desk check-in
 */
const housekeepingTaskSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedName: {
      type: String,
      default: 'Bilal Farooq (Housekeeper)',
    },
    taskType: {
      type: String,
      enum: ['TURNOVER_CLEAN', 'DAILY_TIDY', 'DEEP_CLEAN'],
      default: 'TURNOVER_CLEAN',
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'INSPECTED'],
      default: 'PENDING',
      index: true,
    },
    checklist: {
      linen: { type: Boolean, default: false },
      bathSalts: { type: Boolean, default: false }, // Bathroom supplies & soap
      minibar: { type: Boolean, default: false },   // Water, tea, snacks
      inspection: { type: Boolean, default: false },// Final supervisor inspection
    },
    notes: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('HousekeepingTask', housekeepingTaskSchema)
