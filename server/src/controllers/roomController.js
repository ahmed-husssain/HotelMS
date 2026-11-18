const Room = require('../models/Room')
const { findAvailableRooms, getRoomBookedRanges } = require('../services/availabilityService')

/**
 * LuxuryStay Hospitality — Room Inventory Controller
 * 
 * Serves real-time suite data, Cloudinary photo galleries, and availability.
 */

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

    // 1. Support finding by Mongo ObjectId or roomNumber string ('301', 'Suite 301')
    let room
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      room = await Room.findById(id)
    } else {
      const normalizedRoomNum = id.replace(/^(suite\s*)/i, '').trim()
      room = await Room.findOne({
        $or: [
          { roomNumber: id },
          { roomNumber: `Suite ${normalizedRoomNum}` },
          { roomNumber: normalizedRoomNum },
        ],
      })
    }

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Suite '${id}' not found`,
      })
    }

    // 2. Fetch upcoming booked dates for calendar disabling
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

module.exports = {
  getAllRooms,
  getRoomById,
}
