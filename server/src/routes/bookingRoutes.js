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

/**
 * Booking Routes — Guest Reservation Lifecycle & /my-stay Hub
 */

// 1. Discovery & Hold
router.post('/quote', getQuote)
router.post('/hold', createHold)
router.post('/:reference/release-hold', releaseHold)

// 2. Confirmation & Official PDF Tax Document
router.post('/:reference/confirm', confirmBooking)
router.get('/:reference/invoice', downloadInvoice)

// 3. /my-stay In-Residence Hub Controls
router.get('/lookup', lookupBooking)
router.post('/:reference/unlock', toggleDigitalKey)
router.patch('/:reference/settings', updateInStaySettings)
router.post('/:reference/incidentals', addIncidental)
router.post('/:reference/feedback', submitFeedback)

module.exports = router
