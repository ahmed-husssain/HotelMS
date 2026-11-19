const Room = require('../models/Room')
const ActivityLog = require('../models/ActivityLog')
const { findAvailableRooms, getRoomBookedRanges } = require('../services/availabilityService')

/**
 * Stayza Hospitality — Room Inventory & Live Turnover Controller
 * 
 * Serves real-time suite data, Cloudinary photo galleries, and availability.
 * Broadcasts status and turnover events across WebSocket bus to all staff.
 */

// Helper to resolve room by MongoDB ObjectId or roomNumber string ('301', 'Suite 301')
async function resolveRoom(id) {
  if (!id) return null
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return await Room.findById(id)
  }
  const cleanNumber = String(id).replace(/\D/g, '')
  return await Room.findOne({
    $or: [
      { roomNumber: id },
      { roomNumber: `Suite ${cleanNumber}` },
      { roomNumber: cleanNumber },
      { roomNumber: new RegExp(cleanNumber, 'i') },
    ],
  })
}

// @desc    Get all suites with optional date-range availability filter
// @route   GET /api/rooms
// @access  Public
async function getAllRooms(req, res) {
  try {
    const { checkIn, checkOut, guests, category } = req.query

    // 1. If date range is specified, run availability query
    if (checkIn && checkOut) {
      const minGuests = guests ? parseInt(guests, 10) : 1
      const availableRooms = await findAvailableRooms(checkIn, checkOut, minGuests)

      let result = availableRooms
      if (category && category !== 'all') {
        result = result.filter((r) => r.roomType === category.toLowerCase())
      }

      return res.status(200).json({
        success: true,
        count: result.length,
        isFilteredByDates: true,
        data: result,
      })
    }

    // 2. Otherwise return all published inventory
    const query = { isPublished: true }
    if (category && category !== 'all') {
      query.roomType = category.toLowerCase()
    }

    const rooms = await Room.find(query).sort({ floor: 1, roomNumber: 1 })

    res.status(200).json({
      success: true,
      count: rooms.length,
      isFilteredByDates: false,
      data: rooms,
    })
  } catch (error) {
    console.error('[RoomController.getAllRooms] Error:', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve suites inventory',
      error: error.message,
    })
  }
}

// @desc    Get single suite details with upcoming booked dates
// @route   GET /api/rooms/:id
// @access  Public
async function getRoomById(req, res) {
  try {
    const { id } = req.params
    const room = await resolveRoom(id)

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Suite '${id}' not found`,
      })
    }

    // Fetch upcoming booked dates for calendar disabling
    const bookedRanges = await getRoomBookedRanges(room._id)

    res.status(200).json({
      success: true,
      data: {
        room,
        bookedRanges,
      },
    })
  } catch (error) {
    console.error('[RoomController.getRoomById] Error:', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve suite details',
      error: error.message,
    })
  }
}

// @desc    Update room status (DIRTY, CLEANING, INSPECTED, AVAILABLE, OCCUPIED, MAINTENANCE)
// @route   PATCH /api/rooms/:id/status
// @access  Staff Authorized
async function updateRoomStatus(req, res) {
  try {
    const { id } = req.params
    const { status, cleanerName = 'Staff Member', actor = 'Housekeeping Staff' } = req.body

    const validStatuses = ['AVAILABLE', 'OCCUPIED', 'DIRTY', 'CLEANING', 'INSPECTED', 'MAINTENANCE']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      })
    }

    const room = await resolveRoom(id)
    if (!room) {
      return res.status(404).json({ success: false, message: `Suite '${id}' not found` })
    }

    const previousStatus = room.status
    room.status = status

    // If marked ready/available, ensure all cleaning tasks are marked certified
    if (status === 'AVAILABLE') {
      room.cleaningTasks = { linen: true, bathSalts: true, minibar: true, inspection: true }
    } else if (status === 'DIRTY') {
      room.cleaningTasks = { linen: false, bathSalts: false, minibar: false, inspection: false }
    }

    await room.save()

    // 1. Audit trail
    await ActivityLog.create({
      action: status === 'AVAILABLE' ? 'ROOM_CLEANING_CERTIFIED' : 'ROOM_STATUS_CHANGED',
      details: `${room.roomNumber} transitioned from ${previousStatus} to ${status} by ${cleanerName || actor}`,
      targetModel: 'Room',
      targetId: room._id,
    })

    // 2. Real-Time Broadcast to all Staff & PMS terminals (<40ms latency)
    const io = req.app.get('io')
    if (io) {
      io.emit('room:status_changed', {
        roomNumber: room.roomNumber,
        status: room.status,
        cleaningTasks: room.cleaningTasks,
        assignedCleaner: cleanerName || room.assignedCleaner,
        actor: cleanerName || actor,
        updatedAt: new Date(),
      })
    }

    res.status(200).json({
      success: true,
      message: `Suite ${room.roomNumber} status updated to ${status}`,
      data: room,
    })
  } catch (error) {
    console.error('[RoomController.updateRoomStatus] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update specific housekeeping task checklist on a room
// @route   PATCH /api/rooms/:id/checklist
// @access  Staff Authorized
async function updateCleaningTask(req, res) {
  try {
    const { id } = req.params
    const { taskKey, isComplete, cleanerName = 'Housekeeping Staff' } = req.body

    const validTasks = ['linen', 'bathSalts', 'minibar', 'inspection']
    if (!validTasks.includes(taskKey)) {
      return res.status(400).json({
        success: false,
        message: `Invalid taskKey. Must be one of: ${validTasks.join(', ')}`,
      })
    }

    const room = await resolveRoom(id)
    if (!room) {
      return res.status(404).json({ success: false, message: `Suite '${id}' not found` })
    }

    room.cleaningTasks = room.cleaningTasks || {}
    room.cleaningTasks[taskKey] = Boolean(isComplete)

    // Automatically transition to INSPECTED when all 4 tasks are complete
    const allDone = Object.values(room.cleaningTasks).every(Boolean)
    if (allDone && room.status !== 'AVAILABLE' && room.status !== 'OCCUPIED') {
      room.status = 'INSPECTED'
    } else if (!allDone && room.status === 'DIRTY') {
      room.status = 'CLEANING'
    }

    await room.save()

    // Real-Time Broadcast
    const io = req.app.get('io')
    if (io) {
      io.emit('room:checklist_updated', {
        roomNumber: room.roomNumber,
        status: room.status,
        cleaningTasks: room.cleaningTasks,
        taskKey,
        isComplete: Boolean(isComplete),
        actor: cleanerName,
        updatedAt: new Date(),
      })
    }

    res.status(200).json({
      success: true,
      message: `Suite ${room.roomNumber} task '${taskKey}' updated`,
      data: {
        status: room.status,
        cleaningTasks: room.cleaningTasks,
      },
    })
  } catch (error) {
    console.error('[RoomController.updateCleaningTask] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getAllRooms,
  getRoomById,
  updateRoomStatus,
  updateCleaningTask,
}
