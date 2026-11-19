const express = require('express')
const router = express.Router()
const {
  getAllRooms,
  getRoomById,
  updateRoomStatus,
  updateCleaningTask,
} = require('../controllers/roomController')
const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/rbac')

/**
 * Room Routes — Public Guest & Staff Catalog + Live Operations
 */
router.get('/', getAllRooms)
router.get('/:id', getRoomById)

// Operational Turnover Routes (Protected for Staff & Management)
router.patch('/:id/status', protect, authorize('receptionist', 'housekeeping', 'admin'), updateRoomStatus)
router.patch('/:id/checklist', protect, authorize('receptionist', 'housekeeping', 'admin'), updateCleaningTask)

module.exports = router
