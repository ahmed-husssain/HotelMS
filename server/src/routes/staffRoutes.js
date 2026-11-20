const express = require('express')
const router = express.Router()
const {
  getDashboard,
  checkInGuest,
  addFolioCharge,
  checkOutGuest,
  markNoShow,
  getShiftSummary,
} = require('../controllers/staffOperationsController')
const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/rbac')

/**
 * LuxuryStay Hospitality — Protected Staff & Front Desk Routes
 * 
 * Cryptographically secured with JWT verification (protect) and
 * Role-Based Access Control (authorize('receptionist', 'admin')).
 * Rejects unauthorized guests with HTTP 403 Forbidden.
 */
router.use(protect)
router.use(authorize('receptionist', 'admin'))

// PMS Terminal Board
router.get('/dashboard', getDashboard)

// Guest Check-In & Arrival Processing
router.post('/check-in/:bookingRef', checkInGuest)

// Mark Guest No-Show & Release Suite
router.post('/no-show/:bookingRef', markNoShow)

// Post Folio Extra Service
router.post('/folio/:bookingRef/add', addFolioCharge)

// Final Check-Out & Folio Settlement
router.post('/check-out/:bookingRef', checkOutGuest)

// Cashier Shift & Z-Report
router.get('/shifts/current', getShiftSummary)

module.exports = router
