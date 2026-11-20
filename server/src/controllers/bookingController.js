const mongoose = require('mongoose')
const Room = require('../models/Room')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const User = require('../models/User')
const { calculatePricing } = require('../services/pricingService')
const { checkRoomAvailability } = require('../services/availabilityService')
const { generateInvoicePDF } = require('../services/invoiceService')

/**
 * LuxuryStay Hospitality — Guest Booking & In-Stay Controller
 * 
 * Implements Zero-Trust pricing, 5-minute pessimistic checkout holds,
 * and live /my-stay Guest OS automation.
 */

// Helper to resolve a room by MongoDB ObjectId or room number string (e.g. '301', 'res-301', 'Suite 301')
async function resolveRoom(roomId) {
  if (!roomId) return null
  if (mongoose.Types.ObjectId.isValid(roomId)) {
    const room = await Room.findById(roomId)
    if (room) return room
  }
  const cleanNumber = String(roomId).replace(/\D/g, '')
  if (cleanNumber) {
    return await Room.findOne({
      $or: [
        { roomNumber: cleanNumber },
        { roomNumber: `Suite ${cleanNumber}` },
        { roomNumber: new RegExp(cleanNumber, 'i') },
      ],
    })
  }
  return null
}

// @desc    Calculate verified price quote for a room & dates
// @route   POST /api/bookings/quote
// @access  Public
async function getQuote(req, res) {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, checkInDate, and checkOutDate',
      })
    }

    const room = await resolveRoom(roomId)
    if (!room) {
      return res.status(404).json({ success: false, message: 'Suite not found' })
    }

    // 1. Calculate pricing strictly on the server
    const pricing = calculatePricing(room.baseNightlyRate, checkInDate, checkOutDate)

    // 2. Check if dates are available
    const isAvailable = await checkRoomAvailability(room._id, checkInDate, checkOutDate)

    res.status(200).json({
      success: true,
      data: {
        isAvailable,
        pricing,
        suite: {
          id: room._id,
          name: room.name,
          roomNumber: room.roomNumber,
          tier: room.tier,
          nightlyRate: room.baseNightlyRate,
        },
      },
    })
  } catch (error) {
    console.error('[BookingController.getQuote] Error:', error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}

// @desc    Initiate 5-minute temporary hold while guest fills form/pays
// @route   POST /api/bookings/hold
// @access  Public
async function createHold(req, res) {
  try {
    const { roomId, checkInDate, checkOutDate, guestDetails } = req.body

    if (!roomId || !checkInDate || !checkOutDate || !guestDetails?.name || !guestDetails?.email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, checkInDate, checkOutDate, and guestDetails (name, email)',
      })
    }

    const room = await resolveRoom(roomId)
    if (!room) {
      return res.status(404).json({ success: false, message: 'Suite not found' })
    }

    // 1. Verify availability on resolved room ID
    const isAvailable = await checkRoomAvailability(room._id, checkInDate, checkOutDate)
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'This suite is no longer available for the selected dates. Please choose another date or suite.',
      })
    }

    // 2. Zero-Trust pricing calculation
    const pricing = calculatePricing(room.baseNightlyRate, checkInDate, checkOutDate)

    // 3. Generate unique booking reference: TH-{roomNumber}-{random4}
    const cleanNum = room.roomNumber.replace(/\D/g, '') || '301'
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const bookingReference = `TH-${cleanNum}-${randomSuffix}`

    // 4. Set 5-Minute Pessimistic Hold Lock (Doc TRD 3.2)
    const holdDurationMs = 5 * 60 * 1000
    const holdExpiresAt = new Date(Date.now() + holdDurationMs)

    // Check if guest user already exists in DB
    const existingUser = await User.findOne({ email: guestDetails.email.toLowerCase() })

    const booking = await Booking.create({
      bookingReference,
      guest: existingUser ? existingUser._id : null,
      room: room._id,
      roomNumber: room.roomNumber,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      numberOfNights: pricing.numberOfNights,
      guestDetails: {
        name: guestDetails.name.trim(),
        email: guestDetails.email.toLowerCase().trim(),
        phone: guestDetails.phone || '+92 300 0000000',
        specialRequests: guestDetails.specialRequests || '',
      },
      pricingSnapshot: {
        nightlyRate: pricing.nightlyRate,
        subtotal: pricing.subtotal,
        taxPercent: pricing.taxPercent,
        taxAmount: pricing.taxAmount,
        totalAmount: pricing.totalAmount,
        advancePercent: pricing.advancePercent,
        advanceAmount: pricing.advanceAmount,
        advancePaid: 0,
        balanceDue: pricing.balanceDue,
        currency: 'PKR',
      },
      status: 'AWAITING_PAYMENT',
      holdExpiresAt,
      inStaySettings: {
        isDND: false,
        climateMode: 'ocean',
      },
      digitalKeyAccess: {
        isUnlocked: false,
        lastUnlockedAt: null,
      },
      incidentals: [],
    })

    res.status(201).json({
      success: true,
      message: 'Suite placed on 5-minute checkout hold',
      data: {
        bookingId: booking._id,
        bookingReference: booking.bookingReference,
        holdExpiresAt: booking.holdExpiresAt,
        pricingSnapshot: booking.pricingSnapshot,
        suite: {
          name: room.name,
          roomNumber: room.roomNumber,
          tier: room.tier,
        },
      },
    })
  } catch (error) {
    console.error('[BookingController.createHold] Error:', error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}

// @desc    Release temporary hold if guest cancels checkout
// @route   POST /api/bookings/:reference/release-hold
// @access  Public
async function releaseHold(req, res) {
  try {
    const { reference } = req.params

    const booking = await Booking.findOne({ bookingReference: reference })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }

    // Only release if still awaiting payment
    if (booking.status === 'AWAITING_PAYMENT') {
      booking.status = 'CANCELLED'
      booking.holdExpiresAt = null
      await booking.save()
    }

    res.status(200).json({
      success: true,
      message: 'Suite hold released successfully',
    })
  } catch (error) {
    console.error('[BookingController.releaseHold] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Confirm booking upon successful 30% advance deposit
// @route   POST /api/bookings/:reference/confirm
// @access  Public
async function confirmBooking(req, res) {
  try {
    const { reference } = req.params
    const { paymentMethod = 'SAFEPAY_ONLINE', safepayReference, notes } = req.body

    const booking = await Booking.findOne({ bookingReference: reference }).populate('room')
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }

    if (booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN') {
      return res.status(200).json({
        success: true,
        message: 'Reservation is already confirmed',
        data: booking,
      })
    }

    // 1. Transition booking to CONFIRMED and release hold lock
    const advancePaid = booking.pricingSnapshot.advanceAmount
    booking.status = 'CONFIRMED'
    booking.holdExpiresAt = null
    booking.pricingSnapshot.advancePaid = advancePaid
    booking.pricingSnapshot.balanceDue = booking.pricingSnapshot.totalAmount - advancePaid
    await booking.save()

    // 2. Append immutable record to payments ledger (Doc TRD 2.4)
    const receiptNumber = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const idempotencyKey = `idemp-${booking.bookingReference}-${Date.now()}`

    await Payment.create({
      bookingId: booking._id,
      guestId: booking.guest || null,
      transactionType: 'ADVANCE_30',
      paymentMethod,
      amount: advancePaid,
      currency: 'PKR',
      status: 'SUCCEEDED',
      idempotencyKey,
      safepayReference: safepayReference || `DEMO-${Date.now()}`,
      receiptNumber,
      notes: notes || 'Online 30% advance reservation deposit',
      paidAt: new Date(),
    })

    res.status(200).json({
      success: true,
      message: 'Reservation confirmed successfully with 30% advance deposit',
      data: {
        booking,
        receiptNumber,
      },
    })
  } catch (error) {
    console.error('[BookingController.confirmBooking] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Lookup active booking for /my-stay Guest OS portal
// @route   GET /api/bookings/lookup
// @access  Public
async function lookupBooking(req, res) {
  try {
    const { ref, email } = req.query

    if (!ref && !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a booking reference (ref) or email address',
      })
    }

    const query = {}
    if (ref) {
      query.bookingReference = ref.trim().toUpperCase()
    } else if (email) {
      query['guestDetails.email'] = email.toLowerCase().trim()
      query.status = { $in: ['CHECKED_IN', 'CONFIRMED'] }
    }

    // Sort by latest stay
    const booking = await Booking.findOne(query)
      .populate('room')
      .populate('guest', 'name email phone activeReservationCode')
      .sort({ createdAt: -1 })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No active reservation found matching query: ${ref || email}`,
      })
    }

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error('[BookingController.lookupBooking] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Toggle digital key door access
// @route   POST /api/bookings/:reference/unlock
// @access  Public
async function toggleDigitalKey(req, res) {
  try {
    const { reference } = req.params

    const booking = await Booking.findOne({ bookingReference: reference })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }

    booking.digitalKeyAccess.isUnlocked = !booking.digitalKeyAccess.isUnlocked
    booking.digitalKeyAccess.lastUnlockedAt = new Date()
    await booking.save()

    res.status(200).json({
      success: true,
      message: booking.digitalKeyAccess.isUnlocked ? 'Suite door unlocked' : 'Suite door secured',
      data: booking.digitalKeyAccess,
    })
  } catch (error) {
    console.error('[BookingController.toggleDigitalKey] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update in-stay settings (DND, Climate)
// @route   PATCH /api/bookings/:reference/settings
// @access  Public
async function updateInStaySettings(req, res) {
  try {
    const { reference } = req.params
    const { isDND, climateMode } = req.body

    const booking = await Booking.findOne({ bookingReference: reference })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }

    if (typeof isDND === 'boolean') {
      booking.inStaySettings.isDND = isDND
    }
    if (climateMode) {
      booking.inStaySettings.climateMode = climateMode
    }

    await booking.save()

    res.status(200).json({
      success: true,
      message: 'In-stay settings updated',
      data: booking.inStaySettings,
    })
  } catch (error) {
    console.error('[BookingController.updateInStaySettings] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Append in-stay incidental charge (room service, spa, helipad)
// @route   POST /api/bookings/:reference/incidentals
// @access  Public
async function addIncidental(req, res) {
  try {
    const { reference } = req.params
    const { title, price, category = 'General', addedBy = 'In-House Guest' } = req.body

    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: 'Title and price are required' })
    }

    const booking = await Booking.findOne({ bookingReference: reference })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }

    const newIncidental = {
      id: `srv-${Date.now()}`,
      title: title.trim(),
      price: Math.max(0, Math.round(Number(price))),
      category,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      addedBy,
    }

    booking.incidentals.push(newIncidental)
    await booking.save()

    res.status(201).json({
      success: true,
      message: 'Service charge added to stay folio',
      data: booking.incidentals,
    })
  } catch (error) {
    console.error('[BookingController.addIncidental] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Submit guest experience feedback & rating
// @route   POST /api/bookings/:reference/feedback
// @access  Public
async function submitFeedback(req, res) {
  try {
    const { reference } = req.params
    const { rating, comment, tags = [] } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars' })
    }

    const booking = await Booking.findOne({ bookingReference: reference })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }

    booking.feedback = {
      rating: Number(rating),
      comment: (comment || '').trim(),
      tags: Array.isArray(tags) ? tags : [],
      submittedAt: new Date(),
    }

    await booking.save()

    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback! It has been submitted directly to hotel management.',
      data: booking.feedback,
    })
  } catch (error) {
    console.error('[BookingController.submitFeedback] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Generate and stream official PDF tax invoice / advance receipt
 * @route   GET /api/bookings/:reference/invoice
 * @access  Public (Guest with reference) / Staff
 */
async function downloadInvoice(req, res) {
  try {
    const { reference } = req.params

    if (!reference) {
      return res.status(400).json({ success: false, message: 'Please provide a booking reference' })
    }

    // Locate booking in MongoDB (case-insensitive)
    const booking = await Booking.findOne({
      bookingReference: new RegExp('^' + reference + '$', 'i'),
    }).populate('room')

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }

    // Fetch any associated payments (e.g. 30% online advance deposit)
    const payments = await Payment.find({ bookingId: booking._id }).sort({ createdAt: 1 })

    // Stream PDF directly to client response
    generateInvoicePDF(booking, payments, res)
  } catch (error) {
    console.error('[BookingController.downloadInvoice] Error:', error.message)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate PDF invoice: ' + error.message })
    }
  }
}

module.exports = {
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
}
