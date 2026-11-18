const express = require('express')
const router = express.Router()
const {
  getDashboard,
  checkInGuest,
  addFolioCharge,
  checkOutGuest,
  getShiftSummary,
} = require('../controllers/staffOperationsController')

/**
 * LuxuryStay Hospitality — Staff & Front Desk Routes
 */

// PMS Terminal Board
router.get('/dashboard', getDashboard)

// Guest Check-In & Arrival Processing
router.post('/check-in/:bookingRef', checkInGuest)

// Post Folio Extra Service
router.post('/folio/:bookingRef/add', addFolioCharge)

// Final Check-Out & Folio Settlement
router.post('/check-out/:bookingRef', checkOutGuest)

// Cashier Shift & Z-Report
router.get('/shifts/current', getShiftSummary)

module.exports = router
