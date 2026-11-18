const express = require('express')
const router = express.Router()
const { getAllRooms, getRoomById } = require('../controllers/roomController')

/**
 * Room Routes — Public Guest & Staff Catalog
 */
router.get('/', getAllRooms)
router.get('/:id', getRoomById)

module.exports = router
