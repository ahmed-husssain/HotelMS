const mongoose = require('mongoose')
const Room = require('../models/Room')
const Booking = require('../models/Booking')

/**
 * LuxuryStay Hospitality — Room Availability & Concurrency Service
 * 
 * Implements strict date-range overlap logic and 5-minute pessimistic lock
 * queries (Doc TRD 3.1 & 3.2).
 */

/**
 * Checks whether a specific room is available for the given date range.
 * Supports both MongoDB ObjectId and room number identifiers (e.g., '301', 'res-301').
 * 
 * @param {string|ObjectId} roomId - Room MongoDB ObjectId or Room Number
 * @param {Date|string} checkInDate - Arrival date
 * @param {Date|string} checkOutDate - Departure date
 * @param {string|null} excludeBookingId - Optional booking ID to ignore (e.g., renewing hold)
 * @returns {Promise<boolean>} True if available, false if conflict exists
 */
async function checkRoomAvailability(roomId, checkInDate, checkOutDate, excludeBookingId = null) {
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)

  // 1. Resolve Room by ObjectId or Room Number / Suite Name
  let room = null
  if (mongoose.Types.ObjectId.isValid(roomId)) {
    room = await Room.findById(roomId).select('status isPublished maintenance _id roomNumber')
  }
  if (!room) {
    const roomNum = String(roomId).replace(/\D/g, '')
    if (roomNum) {
      room = await Room.findOne({
        $or: [
          { roomNumber: roomNum },
          { roomNumber: `Suite ${roomNum}` },
          { roomNumber: new RegExp(roomNum, 'i') },
        ],
      }).select('status isPublished maintenance _id roomNumber')
    }
  }

  if (!room || !room.isPublished) {
    return false
  }

  // 2. Reject if room is currently under critical maintenance
  if (room.status === 'MAINTENANCE' || (room.maintenance && room.maintenance.isReported && room.maintenance.status !== 'RESOLVED')) {
    return false
  }

  // 3. Build atomic overlap query (Doc TRD 3.1)
  // Condition: Existing Booking Starts before Request Departure AND Ends after Request Arrival
  const query = {
    room: room._id,
    checkInDate: { $lt: checkOut },
    checkOutDate: { $gt: checkIn },
    $or: [
      { status: { $in: ['CONFIRMED', 'CHECKED_IN'] } },
      { status: 'AWAITING_PAYMENT', holdExpiresAt: { $gt: new Date() } },
    ],
  }

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId }
  }

  const conflictingBooking = await Booking.findOne(query).select('_id bookingReference status')
  return !conflictingBooking
}

/**
 * Finds all rooms that are completely free during the requested date window.
 * 
 * @param {Date|string} checkInDate - Arrival date
 * @param {Date|string} checkOutDate - Departure date
 * @param {number} minGuests - Minimum adult guest capacity
 * @returns {Promise<Array>} List of available Room documents
 */
async function findAvailableRooms(checkInDate, checkOutDate, minGuests = 1) {
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)

  // 1. Find all active bookings overlapping with desired dates
  const overlappingBookings = await Booking.find({
    checkInDate: { $lt: checkOut },
    checkOutDate: { $gt: checkIn },
    $or: [
      { status: { $in: ['CONFIRMED', 'CHECKED_IN'] } },
      { status: 'AWAITING_PAYMENT', holdExpiresAt: { $gt: new Date() } },
    ],
  }).select('room')

  const bookedRoomIds = overlappingBookings.map((b) => b.room)

  // 2. Query published rooms excluding the booked room IDs
  const availableRooms = await Room.find({
    _id: { $nin: bookedRoomIds },
    isPublished: true,
    status: { $ne: 'MAINTENANCE' },
    'capacity.adults': { $gte: minGuests },
  }).sort({ baseNightlyRate: 1 })

  return availableRooms
}

/**
 * Returns upcoming booked date ranges for a room (used to grey out calendar dates).
 * 
 * @param {string|ObjectId} roomId - Room MongoDB ObjectId
 * @returns {Promise<Array>} List of booked date windows
 */
async function getRoomBookedRanges(roomId) {
  const now = new Date()

  let targetId = roomId
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    const roomNum = String(roomId).replace(/\D/g, '')
    if (roomNum) {
      const room = await Room.findOne({ roomNumber: roomNum }).select('_id')
      if (room) targetId = room._id
    }
  }

  const bookings = await Booking.find({
    room: targetId,
    checkOutDate: { $gt: now },
    $or: [
      { status: { $in: ['CONFIRMED', 'CHECKED_IN'] } },
      { status: 'AWAITING_PAYMENT', holdExpiresAt: { $gt: now } },
    ],
  })
    .select('checkInDate checkOutDate status bookingReference')
    .sort({ checkInDate: 1 })

  return bookings.map((b) => ({
    checkIn: b.checkInDate,
    checkOut: b.checkOutDate,
    status: b.status,
  }))
}

module.exports = {
  checkRoomAvailability,
  findAvailableRooms,
  getRoomBookedRanges,
}
