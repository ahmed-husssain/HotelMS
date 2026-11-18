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
} = require('../controllers/bookingController')

/**
 * Booking Routes — Guest Reservation Lifecycle & /my-stay Hub
 */

// 1. Discovery & Hold
router.post('/quote', getQuote)
router.post('/hold', createHold)
router.post('/:reference/release-hold', releaseHold)

// 2. Confirmation
router.post('/:reference/confirm', confirmBooking)

// 3. /my-stay In-Residence Hub Controls
router.get('/lookup', lookupBooking)
router.post('/:reference/unlock', toggleDigitalKey)
router.patch('/:reference/settings', updateInStaySettings)
router.post('/:reference/incidentals', addIncidental)
router.post('/:reference/feedback', submitFeedback)

module.exports = router
