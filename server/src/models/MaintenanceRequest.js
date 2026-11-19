const mongoose = require('mongoose')

/**
 * MaintenanceRequest Schema — Facilities Defect Management & Room Locking (Doc TRD 2.8)
 * 
 * When an issue is reported, the room can be locked to MAINTENANCE to prevent
 * accidental assignment by Front Desk.
 */
const maintenanceRequestSchema = new mongoose.Schema(
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
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportedByName: {
      type: String,
      default: 'Housekeeping Staff',
    },
    assignedTechnician: {
      type: String,
      default: 'Chief Engineer Rashid',
    },
    issueCategory: {
      type: String,
      enum: ['PLUMBING', 'ELECTRICAL', 'HVAC_AIR_CONDITIONING', 'CARPENTRY', 'ELECTRONICS', 'OTHER'],
      default: 'OTHER',
    },
    issueDescription: {
      type: String,
      required: [true, 'Please provide issue description'],
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['REPORTED', 'IN_PROGRESS', 'RESOLVED'],
      default: 'REPORTED',
      index: true,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema)
