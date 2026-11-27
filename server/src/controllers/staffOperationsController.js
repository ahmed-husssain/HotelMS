const User = require('../models/User')
const Room = require('../models/Room')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const ActivityLog = require('../models/ActivityLog')
const { sendCheckoutInvoiceEmail } = require('../services/emailService')

/**
 * Stayza Hospitality — Staff & Front Desk Operations Controller
 * 
 * Property Management System (PMS) Operations, Folio Settlement
 * and Cashier Shift Reconciliation strictly against MongoDB Atlas.
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
        (b) => String(b.room?._id || b.room) === String(room._id) || b.roomNumber === room.roomNumber
      )

      return {
        _id: room._id,
        roomNumber: room.roomNumber,
        locationId: room.locationId || 'sindh-coast',
        city: room.city || 'Karachi',
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
      locationId: b.locationId || 'sindh-coast',
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

    // 6. Calculate PMS Operational Metrics
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
    const { roomNumber, paymentMethod, settleBalanceNow, actorName = 'Front Desk' } = req.body

    let booking = await Booking.findOne({ bookingReference: bookingRef }).populate('room')
    if (!booking) {
      // If it's a walk-in, resolve room and create walk-in stay
      const targetRoom = await resolveRoom(roomNumber)
      if (!targetRoom) {
        return res.status(404).json({ success: false, message: 'Reservation or Suite not found' })
      }

      // Guard: Cannot check in to a dirty or maintenance room
      if (['DIRTY', 'CLEANING', 'MAINTENANCE'].includes(targetRoom.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot check in: ${targetRoom.roomNumber} is currently ${targetRoom.status}. Please select an available clean suite.`,
        })
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
          email: req.body.guestEmail || 'walkin@stayza.com',
          phone: req.body.guestPhone || '+92 300 0000000',
        },
        pricingSnapshot: {
          nightlyRate: targetRoom.baseNightlyRate,
          subtotal: targetRoom.baseNightlyRate,
          taxPercent: 0,
          taxAmount: 0,
          totalAmount: targetRoom.baseNightlyRate,
          advancePercent: 30,
          advanceAmount: Math.round(targetRoom.baseNightlyRate * 0.3),
          advancePaid: Math.round(targetRoom.baseNightlyRate * 0.3),
          balanceDue: Math.round(targetRoom.baseNightlyRate * 0.7),
          currency: 'PKR',
        },
        status: 'CHECKED_IN',
        checkedInAt: new Date(),
        incidentals: [],
      })

      // Lock target room status to OCCUPIED in database
      targetRoom.status = 'OCCUPIED'
      await targetRoom.save()
    } else {
      // Room Reassignment check & Dirty room guard
      let targetRoom = null
      if (roomNumber && roomNumber !== booking.roomNumber) {
        targetRoom = await resolveRoom(roomNumber)
        if (!targetRoom) {
          return res.status(404).json({ success: false, message: `Suite ${roomNumber} not found` })
        }
      } else {
        targetRoom = await Room.findById(booking.room)
      }

      if (!targetRoom) {
        return res.status(404).json({ success: false, message: 'Assigned suite not found' })
      }

      // Guard: Cannot check in to a dirty or maintenance room
      if (['DIRTY', 'CLEANING', 'MAINTENANCE'].includes(targetRoom.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot check in: ${targetRoom.roomNumber} is currently ${targetRoom.status}. Please assign an available clean suite.`,
        })
      }

      // Reassign room if different from booked
      if (String(targetRoom._id) !== String(booking.room?._id || booking.room)) {
        const oldRoom = await Room.findById(booking.room)
        if (oldRoom && oldRoom.status === 'OCCUPIED') {
          oldRoom.status = 'AVAILABLE'
          await oldRoom.save()
        }
        booking.room = targetRoom._id
        booking.roomNumber = targetRoom.roomNumber
      }

      // Process 70% balance settlement if collected at check-in
      if (settleBalanceNow && paymentMethod && booking.pricingSnapshot?.balanceDue > 0) {
        const balanceAmt = booking.pricingSnapshot.balanceDue
        const normalizedMethod = paymentMethod === 'CARD' || paymentMethod === 'CARD_POS' ? 'CARD_POS' : 'CASH_AT_DESK'
        const receiptNumber = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

        await Payment.create({
          bookingId: booking._id,
          guestId: booking.guest || null,
          locationId: booking.locationId || 'sindh-coast',
          transactionType: 'BALANCE_70',
          paymentMethod: normalizedMethod,
          amount: balanceAmt,
          currency: 'PKR',
          status: 'SUCCEEDED',
          idempotencyKey: `desk-checkin-${booking.bookingReference}-${Date.now()}`,
          receiptNumber,
          notes: `Check-in balance settlement (${normalizedMethod})`,
          paidAt: new Date(),
        })

        booking.pricingSnapshot.balanceDue = 0
      }

      booking.status = 'CHECKED_IN'
      booking.checkedInAt = new Date()
      await booking.save()

      // Set target room to OCCUPIED
      targetRoom.status = 'OCCUPIED'
      await targetRoom.save()
    }

    // Append to Activity Audit Trail
    await ActivityLog.create({
      action: 'CHECKIN_COMPLETED',
      details: `Checked in ${booking.guestDetails?.name} to ${booking.roomNumber}. Ref: ${booking.bookingReference}`,
      targetModel: 'Booking',
      targetId: booking._id,
    })

    // Broadcast real-time event to all connected PMS & Housekeeping terminals (<40ms)
    const io = req.app.get('io')
    if (io) {
      io.emit('room:status_changed', {
        roomNumber: booking.roomNumber,
        status: 'OCCUPIED',
        guest: booking.guestDetails?.name,
        bookingRef: booking.bookingReference,
        updatedAt: new Date(),
        actor: actorName,
      })
      io.emit('booking:checked_in', {
        bookingRef: booking.bookingReference,
        roomNumber: booking.roomNumber,
        guest: booking.guestDetails?.name,
      })
    }

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
      // Fallback: Lookup active in-house booking by room number
      const cleanRoom = bookingRef.replace(/\D/g, '')
      booking = await Booking.findOne({
        status: 'CHECKED_IN',
        $or: [
          { roomNumber: bookingRef },
          ...(cleanRoom ? [{ roomNumber: new RegExp(cleanRoom, 'i') }] : []),
        ],
      })
    }
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

    // Recalculate balance due (0% transparent all-inclusive luxury pricing)
    const taxAddition = 0
    const totalAddition = chargeAmount
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

    // Broadcast folio update event to connected terminals
    const io = req.app.get('io')
    if (io) {
      io.emit('folio:charge_added', {
        bookingRef: booking.bookingReference,
        roomNumber: booking.roomNumber,
        incidental: newIncidental,
        newBalanceDue: booking.pricingSnapshot.balanceDue,
        totalAmount: booking.pricingSnapshot.totalAmount,
      })
    }

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
    const normalizedMethod =
      paymentMethod === 'CARD' || paymentMethod === 'CARD_POS'
        ? 'CARD_POS'
        : 'CASH_AT_DESK'

    // Record balance settlement payment in immutable ledger
    if (balanceRemaining > 0) {
      const receiptNumber = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      await Payment.create({
        bookingId: booking._id,
        guestId: booking.guest || null,
        locationId: booking.locationId || 'sindh-coast',
        transactionType: 'BALANCE_70',
        paymentMethod: normalizedMethod,
        amount: balanceRemaining,
        currency: 'PKR',
        status: 'SUCCEEDED',
        idempotencyKey: `desk-${booking.bookingReference}-${Date.now()}`,
        receiptNumber,
        notes: notes || `Front desk check-out settlement (${normalizedMethod})`,
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

    // Broadcast room status change (DIRTY) and checkout to connected terminals
    const io = req.app.get('io')
    if (io) {
      io.emit('room:status_changed', {
        roomNumber: booking.roomNumber,
        status: 'DIRTY',
        cleaningTasks: room?.cleaningTasks || { linen: false, bathSalts: false, minibar: false, inspection: false },
        priority: 'HIGH',
        updatedAt: new Date(),
        actor: req.body.actorName || 'Front Desk',
      })
      io.emit('booking:checked_out', {
        bookingRef: booking.bookingReference,
        roomNumber: booking.roomNumber,
        guest: booking.guestDetails?.name,
      })
    }

    // Asynchronous Transactional Email Dispatch: Send Final PDF Tax Invoice to guest
    Payment.find({ bookingId: booking._id })
      .then((payments) => sendCheckoutInvoiceEmail(booking, payments))
      .catch((mailErr) => console.warn('[StaffOperations.checkOutGuest] Non-blocking email dispatch warning:', mailErr.message))

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

// @desc    Mark reservation as NO_SHOW, release room to AVAILABLE, retain 30% advance deposit
// @route   POST /api/staff/no-show/:bookingRef
// @access  Public (or Staff Authorized)
async function markNoShow(req, res) {
  try {
    const { bookingRef } = req.params
    const { actorName = 'Front Desk' } = req.body

    const booking = await Booking.findOne({ bookingReference: bookingRef }).populate('room')
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }

    booking.status = 'NO_SHOW'
    await booking.save()

    // Release assigned room back to AVAILABLE if not occupied
    if (booking.room) {
      const room = await Room.findById(booking.room)
      if (room && room.status !== 'OCCUPIED') {
        room.status = 'AVAILABLE'
        await room.save()
      }
    }

    // Append to Activity Audit Trail
    await ActivityLog.create({
      action: 'NO_SHOW_RECORDED',
      details: `Guest ${booking.guestDetails?.name || 'Guest'} marked NO-SHOW for ${booking.bookingReference}. Suite ${booking.roomNumber} released to AVAILABLE. 30% deposit retained.`,
      targetModel: 'Booking',
      targetId: booking._id,
    })

    // Broadcast WebSocket events
    const io = req.app.get('io')
    if (io) {
      io.emit('booking:no_show', {
        bookingRef: booking.bookingReference,
        roomNumber: booking.roomNumber,
        guest: booking.guestDetails?.name,
      })
      if (booking.roomNumber) {
        io.emit('room:status_changed', {
          roomNumber: booking.roomNumber,
          status: 'AVAILABLE',
          actor: actorName,
        })
      }
    }

    res.status(200).json({
      success: true,
      message: `Reservation ${booking.bookingReference} marked NO-SHOW. Suite ${booking.roomNumber} released to AVAILABLE.`,
      data: booking,
    })
  } catch (error) {
    console.error('[StaffOperations.markNoShow] Error:', error.message)
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
  markNoShow,
  getShiftSummary,
}
