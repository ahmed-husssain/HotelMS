const express = require('express')
const router = express.Router()
const {
  getQuote,
  createHold,
  releaseHold,
  confirmBooking,
  lookupBooking,
  toggleDigitalKey,
  updateInStaySettings,
  addIncidental,
  submitFeedback,
  downloadInvoice,
} = require('../controllers/bookingController')
const { protect, verifyBookingOwnerOrStaff, verifyInvoiceAccess } = require('../middleware/auth')

/**
 * Booking Routes — Guest Reservation Lifecycle & /my-stay Hub
 */

// 1. Discovery & Hold
router.post('/quote', getQuote)
router.post('/hold', createHold)
router.post('/:reference/release-hold', releaseHold)

// 2. Confirmation & Official PDF Tax Document
router.post('/:reference/confirm', confirmBooking)
router.get('/:reference/invoice', verifyInvoiceAccess, downloadInvoice)

// 3. /my-stay In-Residence Hub Controls (Cryptographically Secured: Owner or Staff only)
router.get('/lookup', lookupBooking)
router.post('/:reference/unlock', protect, verifyBookingOwnerOrStaff, toggleDigitalKey)
router.patch('/:reference/settings', protect, verifyBookingOwnerOrStaff, updateInStaySettings)
router.post('/:reference/incidentals', protect, verifyBookingOwnerOrStaff, addIncidental)
router.post('/:reference/feedback', protect, verifyBookingOwnerOrStaff, submitFeedback)

module.exports = router
