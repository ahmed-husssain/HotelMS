const User = require('../models/User')
const Room = require('../models/Room')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const ActivityLog = require('../models/ActivityLog')

/**
 * LuxuryStay Hospitality — Staff & Front Desk Operations Controller
 * 
 * Implements Aptech Module 3 (PMS Operations), Module 4 (Folio Settlement),
 * and Module 5 (Cashier Shift Reconciliation) strictly against MongoDB Atlas.
 */

// Helper to resolve room by ObjectId or string room number
async function resolveRoom(roomId) {
  if (!roomId) return null
  const cleanNumber = String(roomId).replace(/\D/g, '')
  return await Room.findOne({
    $or: [
      { roomNumber: cleanNumber },
      { roomNumber: `Suite ${cleanNumber}` },
      { roomNumber: new RegExp(cleanNumber, 'i') },
    ],
  })
}

// @desc    Get live Front Desk PMS Dashboard (Rooms, In-House, Expected Arrivals, Metrics)
// @route   GET /api/staff/dashboard
// @access  Public (or Staff Authorized)
async function getDashboard(req, res) {
  try {
    // 1. Fetch all rooms
    const rooms = await Room.find({}).sort({ floor: 1, roomNumber: 1 })

    // 2. Fetch in-house active bookings (CHECKED_IN)
    const inHouseBookings = await Booking.find({ status: 'CHECKED_IN' })
      .populate('room')
      .populate('guest', 'name email phone')

    // 3. Fetch upcoming confirmed arrivals
    const confirmedArrivals = await Booking.find({ status: 'CONFIRMED' })
      .populate('room')
      .populate('guest', 'name email phone')
      .sort({ checkInDate: 1 })

    // 4. Map rooms to include live in-house guest data if occupied
    const mappedRooms = rooms.map((room) => {
      const activeBooking = inHouseBookings.find(
        (b) => String(b.room?._id || b.room) === String(room._id)
      )

      return {
        _id: room._id,
        roomNumber: room.roomNumber,
        name: room.name,
        tier: room.tier,
        category: room.roomType,
        nightlyRate: room.baseNightlyRate,
        status: room.status,
        floor: room.floor,
        guest: activeBooking ? activeBooking.guestDetails?.name : null,
        phone: activeBooking ? activeBooking.guestDetails?.phone : null,
        checkIn: activeBooking ? activeBooking.checkInDate : null,
        checkOut: activeBooking ? activeBooking.checkOutDate : null,
        nights: activeBooking ? activeBooking.numberOfNights : 0,
        advancePaid: activeBooking ? activeBooking.pricingSnapshot?.advanceAmount : 0,
        balanceDue: activeBooking ? activeBooking.pricingSnapshot?.balanceDue : 0,
        bookingRef: activeBooking ? activeBooking.bookingReference : null,
        incidentals: activeBooking ? activeBooking.incidentals : [],
        assignedCleaner: room.assignedCleaner || 'Bilal Farooq',
        cleaningTasks: room.cleaningTasks || { linen: true, bathSalts: true, minibar: false, inspection: false },
        valetBay: room.valetBay,
        assignedButler: room.assignedButler,
      }
    })

    // 5. Format arrivals
    const formattedArrivals = confirmedArrivals.map((b) => ({
      id: b._id,
      bookingRef: b.bookingReference,
      guest: b.guestDetails?.name || 'Valued Guest',
      phone: b.guestDetails?.phone || '+92 300 0000000',
      roomNumber: b.roomNumber,
      tier: b.room?.tier || 'LUXURY SUITE',
      eta: '14:00 PKT',
      safepayRef: b.safepayRef || 'SPF-ONLINE',
      status: 'Deposit Confirmed (30%)',
      advancePaid: b.pricingSnapshot?.advanceAmount || 0,
      totalValuation: b.pricingSnapshot?.totalAmount || 0,
      balanceDue: b.pricingSnapshot?.balanceDue || 0,
      nights: b.numberOfNights || 1,
      checkInDate: b.checkInDate,
      checkOutDate: b.checkOutDate,
    }))

    // 6. Calculate PMS Telemetry Metrics
    const totalRooms = rooms.length
    const occupiedCount = rooms.filter((r) => r.status === 'OCCUPIED').length
    const availableCount = rooms.filter((r) => r.status === 'AVAILABLE').length
    const dirtyCount = rooms.filter((r) => r.status === 'DIRTY' || r.status === 'CLEANING').length
    const maintenanceCount = rooms.filter((r) => r.status === 'MAINTENANCE').length
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0

    res.status(200).json({
      success: true,
      data: {
        rooms: mappedRooms,
        arrivals: formattedArrivals,
        inHouse: inHouseBookings,
        metrics: {
          totalRooms,
          occupiedCount,
          availableCount,
          dirtyCount,
          maintenanceCount,
          occupancyRate,
        },
      },
    })
  } catch (error) {
    console.error('[StaffOperations.getDashboard] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Check-in guest & issue digital/physical room key
// @route   POST /api/staff/check-in/:bookingRef
// @access  Public (or Staff Authorized)
async function checkInGuest(req, res) {
  try {
    const { bookingRef } = req.params
    const { roomNumber } = req.body

    let booking = await Booking.findOne({ bookingReference: bookingRef }).populate('room')
    if (!booking) {
      // If it's a walk-in, resolve room and create walk-in stay
      const targetRoom = await resolveRoom(roomNumber)
      if (!targetRoom) {
        return res.status(404).json({ success: false, message: 'Reservation or Suite not found' })
      }

      booking = await Booking.create({
        bookingReference: `TH-${targetRoom.roomNumber.replace(/\D/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        room: targetRoom._id,
        roomNumber: targetRoom.roomNumber,
        checkInDate: new Date(),
        checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        numberOfNights: 1,
        guestDetails: {
          name: req.body.guestName || 'Walk-In Guest',
          email: req.body.guestEmail || 'walkin@habitas.com',
          phone: req.body.guestPhone || '+92 300 0000000',
        },
        pricingSnapshot: {
          nightlyRate: targetRoom.baseNightlyRate,
          subtotal: targetRoom.baseNightlyRate,
          taxPercent: 13,
          taxAmount: Math.round(targetRoom.baseNightlyRate * 0.13),
          totalAmount: Math.round(targetRoom.baseNightlyRate * 1.13),
          advancePercent: 30,
          advanceAmount: Math.round(targetRoom.baseNightlyRate * 1.13 * 0.3),
          advancePaid: Math.round(targetRoom.baseNightlyRate * 1.13 * 0.3),
          balanceDue: Math.round(targetRoom.baseNightlyRate * 1.13 * 0.7),
          currency: 'PKR',
        },
        status: 'CHECKED_IN',
        checkedInAt: new Date(),
        incidentals: [],
      })
    } else {
      booking.status = 'CHECKED_IN'
      booking.checkedInAt = new Date()
      await booking.save()
    }

    // Set Room to OCCUPIED
    const room = await Room.findById(booking.room)
    if (room) {
      room.status = 'OCCUPIED'
      await room.save()
    }

    // Append to Activity Audit Trail
    await ActivityLog.create({
      action: 'CHECKIN_COMPLETED',
      details: `Checked in ${booking.guestDetails?.name} to ${booking.roomNumber}. Ref: ${booking.bookingReference}`,
      targetModel: 'Booking',
      targetId: booking._id,
    })

    res.status(200).json({
      success: true,
      message: `Guest successfully checked in to ${booking.roomNumber}`,
      data: booking,
    })
  } catch (error) {
    console.error('[StaffOperations.checkInGuest] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Post incidental extra charge (Dining, Laundry, Spa, Airport Transfer) to active folio
// @route   POST /api/staff/folio/:bookingRef/add
// @access  Public (or Staff Authorized)
async function addFolioCharge(req, res) {
  try {
    const { bookingRef } = req.params
    const { item, description, amount, price, category = 'Food & Beverage' } = req.body

    const chargeAmount = Number(amount || price || 0)
    const chargeTitle = item || description || 'Incidental Service'

    if (chargeAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Charge amount must be greater than zero' })
    }

    let booking = await Booking.findOne({ bookingReference: bookingRef })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Active reservation not found' })
    }

    const newIncidental = {
      id: `inc-${Date.now()}`,
      title: chargeTitle,
      category,
      price: chargeAmount,
      orderedAt: new Date(),
    }

    booking.incidentals.push(newIncidental)

    // Recalculate balance due with 13% tax on new charge
    const taxAddition = Math.round(chargeAmount * 0.13)
    const totalAddition = chargeAmount + taxAddition
    booking.pricingSnapshot.totalAmount += totalAddition
    booking.pricingSnapshot.taxAmount += taxAddition
    booking.pricingSnapshot.balanceDue += totalAddition

    await booking.save()

    // Append to Activity Audit Trail
    await ActivityLog.create({
      action: 'FOLIO_CHARGE_POSTED',
      details: `Posted ${chargeTitle} (PKR ${chargeAmount.toLocaleString()}) to ${booking.bookingReference}`,
      targetModel: 'Booking',
      targetId: booking._id,
    })

    res.status(200).json({
      success: true,
      message: `Posted "${chargeTitle}" (PKR ${chargeAmount.toLocaleString()}) to folio`,
      data: booking,
    })
  } catch (error) {
    console.error('[StaffOperations.addFolioCharge] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Check-out guest, collect remaining 70% balance + folio, set room to DIRTY
// @route   POST /api/staff/check-out/:bookingRef
// @access  Public (or Staff Authorized)
async function checkOutGuest(req, res) {
  try {
    const { bookingRef } = req.params
    const { paymentMethod = 'CASH_AT_DESK', notes } = req.body

    const booking = await Booking.findOne({ bookingReference: bookingRef }).populate('room')
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }

    const balanceRemaining = booking.pricingSnapshot?.balanceDue || 0

    // Record balance settlement payment in immutable ledger
    if (balanceRemaining > 0) {
      const receiptNumber = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      await Payment.create({
        bookingId: booking._id,
        guestId: booking.guest || null,
        transactionType: 'BALANCE_70',
        paymentMethod,
        amount: balanceRemaining,
        currency: 'PKR',
        status: 'SUCCEEDED',
        idempotencyKey: `desk-${booking.bookingReference}-${Date.now()}`,
        receiptNumber,
        notes: notes || 'Front desk final check-out settlement',
        paidAt: new Date(),
      })
    }

    // Transition Booking status
    booking.status = 'CHECKED_OUT'
    booking.checkedOutAt = new Date()
    booking.pricingSnapshot.balanceDue = 0
    await booking.save()

    // Transition Room status to DIRTY (Doc FR-4.1)
    const room = await Room.findById(booking.room)
    if (room) {
      room.status = 'DIRTY'
      room.cleaningTasks = { linen: false, bathSalts: false, minibar: false, inspection: false }
      await room.save()
    }

    // Append to Activity Audit Trail
    await ActivityLog.create({
      action: 'CHECKOUT_COMPLETED',
      details: `Checked out ${booking.guestDetails?.name} from ${booking.roomNumber}. Balance settled: PKR ${balanceRemaining.toLocaleString()}`,
      targetModel: 'Booking',
      targetId: booking._id,
    })

    res.status(200).json({
      success: true,
      message: `Guest checked out successfully. Room ${booking.roomNumber} is now marked DIRTY for housekeeping turnover.`,
      data: booking,
    })
  } catch (error) {
    console.error('[StaffOperations.checkOutGuest] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get Cashier Shift Reconciliation (Z-Report)
// @route   GET /api/staff/shifts/current
// @access  Public (or Staff Authorized)
async function getShiftSummary(req, res) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deskPayments = await Payment.find({
      paidAt: { $gte: today },
      transactionType: { $in: ['BALANCE_70', 'EXTRA_SERVICE'] },
    }).populate('bookingId')

    const cashCollected = deskPayments
      .filter((p) => p.paymentMethod === 'CASH_AT_DESK')
      .reduce((sum, p) => sum + p.amount, 0)

    const cardCollected = deskPayments
      .filter((p) => p.paymentMethod === 'CARD_POS' || p.paymentMethod === 'CARD_AT_DESK')
      .reduce((sum, p) => sum + p.amount, 0)

    const openingFloat = 50000 // Standard PKR 50,000 cash drawer float
    const expectedCashTotal = openingFloat + cashCollected

    res.status(200).json({
      success: true,
      data: {
        openingFloat,
        cashCollected,
        cardCollected,
        expectedCashTotal,
        paymentCount: deskPayments.length,
        payments: deskPayments,
      },
    })
  } catch (error) {
    console.error('[StaffOperations.getShiftSummary] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getDashboard,
  checkInGuest,
  addFolioCharge,
  checkOutGuest,
  getShiftSummary,
}
