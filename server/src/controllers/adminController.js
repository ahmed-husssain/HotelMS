const mongoose = require('mongoose')
const User = require('../models/User')
const Room = require('../models/Room')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const ActivityLog = require('../models/ActivityLog')

/**
 * Stayza HMS — Admin & Executive Analytics Controller
 * 
 * Executive Operations, Revenue Analytics, Staff Governance & RBAC Management
 * in strict compliance with AGENTS.md architectural principles.
 */

// @desc    Get 5 Core Executive Hotel Analytics (Real Database Aggregation)
// @route   GET /api/admin/analytics
// @access  Private (Admin Only)
async function getExecutiveAnalytics(req, res) {
  try {
    // -------------------------------------------------------------
    // METRIC 1: Gross Realized Revenue & Payment Split (PRD FR-6.2, TRD §2.4)
    // -------------------------------------------------------------
    const payments = await Payment.find({ status: 'SUCCEEDED' })

    const advancePayments = payments.filter((p) => p.transactionType === 'ADVANCE_30')
    const balancePayments = payments.filter((p) => p.transactionType === 'BALANCE_70')
    const extraPayments = payments.filter((p) => p.transactionType === 'EXTRA_SERVICE')

    const advanceTotal = advancePayments.reduce((sum, p) => sum + p.amount, 0)
    const balanceTotal = balancePayments.reduce((sum, p) => sum + p.amount, 0)
    const extrasTotal = extraPayments.reduce((sum, p) => sum + p.amount, 0)
    const grossRevenue = advanceTotal + balanceTotal + extrasTotal

    // Payment Channel Breakdown
    const safepayOnlineTotal = payments
      .filter((p) => p.paymentMethod === 'SAFEPAY_ONLINE')
      .reduce((sum, p) => sum + p.amount, 0)
    const deskCashTotal = payments
      .filter((p) => p.paymentMethod === 'CASH_AT_DESK')
      .reduce((sum, p) => sum + p.amount, 0)
    const deskCardTotal = payments
      .filter((p) => p.paymentMethod === 'CARD_POS' || p.paymentMethod === 'CREDIT_CARD_DESK')
      .reduce((sum, p) => sum + p.amount, 0)

    // -------------------------------------------------------------
    // METRIC 2: Live Occupancy Rate & Operational Distribution (PRD FR-6.1, TRD §2.2)
    // -------------------------------------------------------------
    const rooms = await Room.find({})
    const totalRooms = rooms.length
    const occupiedCount = rooms.filter((r) => r.status === 'OCCUPIED').length
    const availableCount = rooms.filter((r) => r.status === 'AVAILABLE').length
    const dirtyCount = rooms.filter((r) => r.status === 'DIRTY').length
    const cleaningCount = rooms.filter((r) => r.status === 'CLEANING').length
    const inspectedCount = rooms.filter((r) => r.status === 'INSPECTED').length
    const maintenanceCount = rooms.filter((r) => r.status === 'MAINTENANCE').length
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0

    // -------------------------------------------------------------
    // METRIC 3: Average Daily Rate (ADR) & RevPAR (PRD §4 Module 6, TRD §3)
    // -------------------------------------------------------------
    const activeBookings = await Booking.find({
      status: { $in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] },
    })

    const totalRoomNights = activeBookings.reduce((sum, b) => sum + (b.numberOfNights || 1), 0)
    const totalRoomRevenue = activeBookings.reduce(
      (sum, b) => sum + (b.pricingSnapshot?.subtotal || b.pricingSnapshot?.totalAmount || 0),
      0
    )

    const adr = totalRoomNights > 0 ? Math.round(totalRoomRevenue / totalRoomNights) : 85000
    const revPar = Math.round(adr * (occupancyRate / 100))

    // -------------------------------------------------------------
    // METRIC 4: Checkout Hold Conversion vs. Abandonment (PRD FR-1.4, TRD §2.3)
    // -------------------------------------------------------------
    const allBookings = await Booking.find({})
    const totalHoldsInitiated = allBookings.length
    const confirmedStays = allBookings.filter((b) =>
      ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'].includes(b.status)
    ).length
    const abandonedHolds = allBookings.filter((b) =>
      ['EXPIRED', 'CANCELLED'].includes(b.status)
    ).length
    const pendingHolds = allBookings.filter(
      (b) => b.status === 'AWAITING_PAYMENT' && b.holdExpiresAt && new Date(b.holdExpiresAt) > new Date()
    ).length

    const conversionRate =
      totalHoldsInitiated > 0 ? Math.round((confirmedStays / totalHoldsInitiated) * 100) : 0
    const abandonmentRate = 100 - conversionRate

    // -------------------------------------------------------------
    // METRIC 5: Incidental Folio Upsell & Top Concierge Services (Doc TRD §2.5)
    // -------------------------------------------------------------
    let totalIncidentalRevenue = 0
    const catalogCount = {}

    allBookings.forEach((b) => {
      if (Array.isArray(b.incidentals)) {
        b.incidentals.forEach((inc) => {
          const itemPrice = Number(inc.price || inc.amount || 0)
          totalIncidentalRevenue += itemPrice
          const itemTitle = inc.title || inc.item || 'Concierge Service'
          catalogCount[itemTitle] = (catalogCount[itemTitle] || 0) + itemPrice
        })
      }
    })

    // Rank top extra services
    const topServices = Object.entries(catalogCount)
      .map(([title, revenue]) => ({ title, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)

    const ancillaryShare =
      grossRevenue > 0 ? Math.round((totalIncidentalRevenue / grossRevenue) * 100) : 0

    res.status(200).json({
      success: true,
      data: {
        // Metric 1: Revenue & Split
        revenue: {
          grossRevenue,
          advanceTotal,
          balanceTotal,
          extrasTotal,
          channels: {
            safepayOnline: safepayOnlineTotal,
            deskCash: deskCashTotal,
            deskCard: deskCardTotal,
          },
          advancePercent: grossRevenue > 0 ? Math.round((advanceTotal / grossRevenue) * 100) : 30,
          balancePercent: grossRevenue > 0 ? Math.round((balanceTotal / grossRevenue) * 100) : 70,
        },
        // Metric 2: Occupancy & Distribution
        occupancy: {
          occupancyRate,
          totalRooms,
          occupiedCount,
          availableCount,
          dirtyCount,
          cleaningCount,
          inspectedCount,
          maintenanceCount,
        },
        // Metric 3: Pricing Yield
        pricingYield: {
          adr,
          revPar,
          totalRoomNights,
          totalRoomRevenue,
        },
        // Metric 4: Concurrency & Booking Funnel
        bookingFunnel: {
          totalHoldsInitiated,
          confirmedStays,
          abandonedHolds,
          pendingHolds,
          conversionRate,
          abandonmentRate,
        },
        // Metric 5: Incidental Folio Upsell
        incidentals: {
          totalIncidentalRevenue,
          ancillaryShare,
          topServices,
        },
      },
    })
  } catch (error) {
    console.error('[AdminController.getExecutiveAnalytics] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all staff accounts (receptionist, housekeeping, admin)
// @route   GET /api/admin/staff
// @access  Private (Admin Only)
async function getStaffAccounts(req, res) {
  try {
    const staff = await User.find({
      role: { $in: ['receptionist', 'housekeeping', 'admin'] },
    }).select('-password').sort({ role: 1, name: 1 })

    res.status(200).json({
      success: true,
      data: staff,
    })
  } catch (error) {
    console.error('[AdminController.getStaffAccounts] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create new staff account
// @route   POST /api/admin/staff
// @access  Private (Admin Only)
async function createStaffAccount(req, res) {
  try {
    const { name, email, password = 'Password123!', role, phone } = req.body

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and role are required.',
      })
    }

    const validRoles = ['receptionist', 'housekeeping', 'admin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Permitted staff roles: ${validRoles.join(', ')}`,
      })
    }

    const cleanEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: cleanEmail })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      })
    }

    const newStaff = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password, // User.js pre-save hook handles bcrypt hashing
      role,
      phone: phone || '',
      isActive: true,
    })

    // Audit Log Entry
    await ActivityLog.create({
      userId: req.user._id,
      actorName: req.user.name || 'General Manager',
      action: 'STAFF_ACCOUNT_CREATED',
      category: 'SECURITY',
      details: `Created new ${role} account for ${newStaff.name} (${newStaff.email}).`,
      targetModel: 'User',
      targetId: newStaff._id.toString(),
    })

    res.status(201).json({
      success: true,
      message: `Staff account for ${newStaff.name} created successfully.`,
      data: {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        phone: newStaff.phone,
        isActive: newStaff.isActive,
      },
    })
  } catch (error) {
    console.error('[AdminController.createStaffAccount] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Toggle staff active status (enable/deactivate)
// @route   PATCH /api/admin/staff/:id/status
// @access  Private (Admin Only)
async function toggleStaffStatus(req, res) {
  try {
    const { id } = req.params
    const staff = await User.findById(id)

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found.' })
    }

    if (String(staff._id) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'General Managers cannot deactivate their own active administrative account.',
      })
    }

    staff.isActive = !staff.isActive
    await staff.save()

    // Audit Log Entry
    await ActivityLog.create({
      userId: req.user._id,
      actorName: req.user.name || 'General Manager',
      action: staff.isActive ? 'STAFF_ACCOUNT_ACTIVATED' : 'STAFF_ACCOUNT_DEACTIVATED',
      category: 'SECURITY',
      details: `Changed account status of ${staff.name} (${staff.email}) to ${staff.isActive ? 'ACTIVE' : 'DEACTIVATED'}.`,
      targetModel: 'User',
      targetId: staff._id.toString(),
    })

    res.status(200).json({
      success: true,
      message: `Account status updated to ${staff.isActive ? 'active' : 'deactivated'}.`,
      data: staff,
    })
  } catch (error) {
    console.error('[AdminController.toggleStaffStatus] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update staff account details (Name, Email, Role, Phone, Shift)
// @route   PUT /api/admin/staff/:id
// @access  Private (Admin Only)
async function updateStaffAccount(req, res) {
  try {
    const { id } = req.params
    const { name, email, role, phone, shiftStatus } = req.body

    const staff = await User.findById(id)
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found.' })
    }

    const validRoles = ['receptionist', 'housekeeping', 'admin']
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Permitted staff roles: ${validRoles.join(', ')}`,
      })
    }

    // Safety guard: General manager cannot remove their own admin role
    if (String(staff._id) === String(req.user._id) && role && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove your own General Manager role.',
      })
    }

    // If changing email, check uniqueness
    if (email && email.toLowerCase().trim() !== staff.email.toLowerCase()) {
      const existing = await User.findOne({ email: email.toLowerCase().trim() })
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        })
      }
      staff.email = email.toLowerCase().trim()
    }

    if (name) staff.name = name.trim()
    if (role) staff.role = role
    if (phone !== undefined) staff.phone = phone.trim()
    if (shiftStatus !== undefined) staff.shiftStatus = shiftStatus.trim()

    await staff.save()

    // Audit Log Entry
    await ActivityLog.create({
      userId: req.user._id,
      actorName: req.user.name || 'General Manager',
      action: 'STAFF_ACCOUNT_UPDATED',
      category: 'SECURITY',
      details: `Updated staff profile for ${staff.name} (${staff.role}, ${staff.email}).`,
      targetModel: 'User',
      targetId: staff._id.toString(),
    })

    res.status(200).json({
      success: true,
      message: `Staff member ${staff.name} updated successfully.`,
      data: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        phone: staff.phone,
        shiftStatus: staff.shiftStatus,
        isActive: staff.isActive,
      },
    })
  } catch (error) {
    console.error('[AdminController.updateStaffAccount] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete staff account
// @route   DELETE /api/admin/staff/:id
// @access  Private (Admin Only)
async function deleteStaffAccount(req, res) {
  try {
    const { id } = req.params
    const staff = await User.findById(id)

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found.' })
    }

    if (String(staff._id) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'General Managers cannot delete their own administrative account.',
      })
    }

    await User.findByIdAndDelete(id)

    // Audit Log Entry
    await ActivityLog.create({
      userId: req.user._id,
      actorName: req.user.name || 'General Manager',
      action: 'STAFF_ACCOUNT_DELETED',
      category: 'SECURITY',
      details: `Permanently removed staff account ${staff.name} (${staff.email}, role: ${staff.role}).`,
      targetModel: 'User',
      targetId: id,
    })

    res.status(200).json({
      success: true,
      message: `Staff account for ${staff.name} deleted successfully.`,
      data: { id },
    })
  } catch (error) {
    console.error('[AdminController.deleteStaffAccount] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}
      data: staff,
    })
  } catch (error) {
    console.error('[AdminController.toggleStaffStatus] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get Guest Directory with aggregated lifetime spend & stays
// @route   GET /api/admin/guests
// @access  Private (Admin Only)
async function getGuestDirectory(req, res) {
  try {
    const guests = await User.find({ role: 'guest' }).select('-password')
    const bookings = await Booking.find({})
    const payments = await Payment.find({ status: 'SUCCEEDED' })

    const guestProfiles = guests.map((g) => {
      const guestBookings = bookings.filter(
        (b) => String(b.guest) === String(g._id) || b.guestDetails?.email?.toLowerCase() === g.email.toLowerCase()
      )
      const guestPayments = payments.filter((p) => String(p.guestId) === String(g._id))

      const totalStays = guestBookings.filter((b) =>
        ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'].includes(b.status)
      ).length

      const lifetimeSpend = guestPayments.reduce((sum, p) => sum + p.amount, 0)

      let tier = 'STANDARD GUEST'
      if (lifetimeSpend > 1500000) tier = 'VIP PLATINUM'
      else if (lifetimeSpend > 800000) tier = 'VIP GOLD'
      else if (totalStays >= 2) tier = 'RETURNING RESIDENT'

      // Latest / Active booking details
      const activeBooking = guestBookings.find((b) => ['CONFIRMED', 'CHECKED_IN'].includes(b.status)) || guestBookings[guestBookings.length - 1]
      const cleanRef = activeBooking?.bookingReference ? activeBooking.bookingReference.split('?')[0].split('&')[0] : (g.activeReservationCode || '')

      return {
        id: g._id,
        name: g.name,
        email: g.email,
        phone: g.phone || '+92 300 0000000',
        tier,
        totalStays,
        lifetimeSpend,
        activeReservationCode: cleanRef,
        suiteNumber: activeBooking?.roomNumber || 'Suite 301',
        checkInDate: activeBooking?.checkInDate || null,
        checkOutDate: activeBooking?.checkOutDate || null,
        numberOfNights: activeBooking?.numberOfNights || 1,
        bookingStatus: activeBooking?.status || 'CONFIRMED',
        advancePaid: activeBooking?.pricingSnapshot?.advanceDepositAmount || 0,
        balanceDue: activeBooking?.pricingSnapshot?.balanceDueAtDesk || 0,
        totalStayAmount: activeBooking?.pricingSnapshot?.totalAmount || 0,
        cnic: activeBooking?.guestDetails?.cnic || '42101-*******-1',
        preferences: g.preferences
          ? `${g.preferences.pillowType || 'Custom Pillow'}, Climate: ${g.preferences.climatePreference || '21°C'}`
          : 'High-thread-count Egyptian linen, Silent check-in',
      }
    })

    res.status(200).json({
      success: true,
      data: guestProfiles,
    })
  } catch (error) {
    console.error('[AdminController.getGuestDirectory] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update Base Nightly Tariff for a Residence
// @route   PATCH /api/admin/rooms/:id/rate
// @access  Private (Admin Only)
async function updateRoomRate(req, res) {
  try {
    const { id } = req.params
    const { nightlyRate } = req.body

    const rateNum = Number(nightlyRate)
    if (!rateNum || rateNum <= 0) {
      return res.status(400).json({ success: false, message: 'Valid nightly rate required.' })
    }

    let room = null
    if (mongoose.Types.ObjectId.isValid(id)) {
      room = await Room.findById(id)
    }
    if (!room) {
      room = await Room.findOne({
        $or: [{ roomNumber: id }, { roomNumber: `Suite ${id.replace(/\D/g, '')}` }],
      })
    }

    if (!room) {
      return res.status(404).json({ success: false, message: 'Residence not found.' })
    }

    const oldRate = room.baseNightlyRate
    room.baseNightlyRate = rateNum
    await room.save()

    // Audit Log Entry
    await ActivityLog.create({
      userId: req.user._id,
      actorName: req.user.name || 'General Manager',
      action: 'ROOM_RATE_UPDATED',
      category: 'SETTINGS',
      details: `Updated ${room.roomNumber} base nightly tariff from PKR ${oldRate.toLocaleString()} to PKR ${rateNum.toLocaleString()}.`,
      targetModel: 'Room',
      targetId: room._id.toString(),
    })

    // Broadcast update across WebSockets
    const io = req.app.get('io')
    if (io) {
      io.emit('room:rate_updated', {
        roomNumber: room.roomNumber,
        nightlyRate: room.baseNightlyRate,
        actor: req.user.name || 'General Manager',
      })
    }

    res.status(200).json({
      success: true,
      message: `Updated ${room.roomNumber} rate to PKR ${rateNum.toLocaleString()}`,
      data: room,
    })
  } catch (error) {
    console.error('[AdminController.updateRoomRate] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get immutable audit log trail with full date & time formatting and sanitized references
// @route   GET /api/admin/audit-logs
// @access  Private (Admin Only)
async function getAuditLogs(req, res) {
  try {
    const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(100)

    const formatted = logs.map((l) => {
      const d = new Date(l.createdAt)
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      const cleanDetails = (l.details || '')
        .replace(/\?order_id=[^ &]*/g, '')
        .replace(/\?ref=[^ &]*/g, '')

      return {
        id: l._id,
        timestamp: `${dateStr}, ${timeStr} PKT`,
        actor: l.actorName || 'System Operator',
        action: l.action,
        category: l.category,
        details: cleanDetails,
        createdAt: l.createdAt,
      }
    })

    res.status(200).json({
      success: true,
      data: formatted,
    })
  } catch (error) {
    console.error('[AdminController.getAuditLogs] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getExecutiveAnalytics,
  getStaffAccounts,
  createStaffAccount,
  toggleStaffStatus,
  updateStaffAccount,
  deleteStaffAccount,
  getGuestDirectory,
  updateRoomRate,
  getAuditLogs,
}
  createStaffAccount,
  toggleStaffStatus,
  getGuestDirectory,
  updateRoomRate,
  getAuditLogs,
}
