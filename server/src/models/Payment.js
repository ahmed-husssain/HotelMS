const mongoose = require('mongoose')

/**
 * Payment Schema — Immutable Financial Audit Ledger
 * 
 * Records all monetary transactions:
 * 1. 30% Online Advance Deposits via Safepay (with cryptographic tracker refs)
 * 2. 70% Final Stay Balance collected at front desk (Cash or Card POS)
 * 3. Incidental Folio Settlements & Refunds
 * 
 * Enforces idempotency to guarantee Safepay webhook retries never double-credit.
 */
const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Payment must be linked to a booking'],
      index: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Populated if front-desk receptionist collected payment
    },
    transactionType: {
      type: String,
      enum: {
        values: ['ADVANCE_30', 'BALANCE_70', 'EXTRA_SERVICE', 'REFUND'],
        message: '{VALUE} is not a valid transaction type',
      },
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['SAFEPAY_ONLINE', 'CASH_AT_DESK', 'CARD_POS', 'BANK_TRANSFER'],
        message: '{VALUE} is not a supported payment method',
      },
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide payment amount'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'PENDING',
      index: true,
    },

    // Safepay & Webhook Idempotency (Doc TRD 2.4)
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    safepayReference: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    safepaySignature: {
      type: String,
      default: null,
    },

    // Branded Fiscal Receipt Number
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Payment', paymentSchema)
