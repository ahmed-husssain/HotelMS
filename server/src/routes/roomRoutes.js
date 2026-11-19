const express = require('express')
const router = express.Router()
const {
  getAllRooms,
  getRoomById,
  updateRoomStatus,
  updateCleaningTask,
} = require('../controllers/roomController')

/**
 * Room Routes — Public Guest & Staff Catalog + Live Operations
 */
router.get('/', getAllRooms)
router.get('/:id', getRoomById)

// Operational Turnover Routes (Staff)
router.patch('/:id/status', updateRoomStatus)
router.patch('/:id/checklist', updateCleaningTask)

module.exports = router
