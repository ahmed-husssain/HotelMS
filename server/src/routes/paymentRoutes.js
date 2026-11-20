const express = require('express')
const router = express.Router()
const {
  createCheckoutSession,
  verifyCheckoutSession,
  handleWebhook,
  cancelCheckoutSession,
} = require('../controllers/paymentController')

/**
 * Payment Routes — Safepay Gateway Integration & S2S Webhook Endpoints
 */

// 1. Session Lifecycle
router.post('/checkout-session', createCheckoutSession)
router.post('/verify-session', verifyCheckoutSession)
router.post('/cancel-session', cancelCheckoutSession)

// 2. Authoritative Webhook Listener
router.post('/webhook', handleWebhook)

module.exports = router
