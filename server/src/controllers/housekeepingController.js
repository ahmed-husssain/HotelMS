const Room = require('../models/Room')
const HousekeepingTask = require('../models/HousekeepingTask')
const MaintenanceRequest = require('../models/MaintenanceRequest')
const InventoryItem = require('../models/InventoryItem')
const ActivityLog = require('../models/ActivityLog')

/**
 * Housekeeping & Maintenance Controller (Doc TRD 2.7 & 2.8)
 * 
 * Coordinates room turnarounds, facilities repairs, and the 7 hotel supplies.
 */

// Helper to resolve room number format
function normalizeRoomNumber(num) {
  if (!num) return 'Suite 301'
  return num.toString().startsWith('Suite ') ? num.toString() : `Suite ${num}`
}

/**
 * @desc    Fetch active Housekeeping dashboard (tasks, tickets, inventory)
 * @route   GET /api/housekeeping/dashboard
 * @access  Private (Housekeeping, Receptionist, Admin)
 */
async function getDashboard(req, res) {
  try {
    // 1. Fetch all tasks, populate room data
    const tasks = await HousekeepingTask.find().populate('room', 'name roomNumber tier status').sort({ priority: -1, updatedAt: -1 })

    // 2. Fetch all maintenance tickets
    const tickets = await MaintenanceRequest.find().sort({ createdAt: -1 }).limit(20)

    // 3. Fetch the 7 Inventory Items
    let inventory = await InventoryItem.find().sort({ category: 1, name: 1 })

    // If inventory not yet seeded in collection, return empty or seed defaults
    if (inventory.length === 0) {
      inventory = await seedDefaultInventory()
    }

    // 4. Summaries
    const dirtyCount = await Room.countDocuments({ status: 'DIRTY' })
    const cleaningCount = await Room.countDocuments({ status: { $in: ['CLEANING', 'DIRTY'] } })
    const availableCount = await Room.countDocuments({ status: 'AVAILABLE' })
    const openTicketsCount = await MaintenanceRequest.countDocuments({ status: { $ne: 'RESOLVED' } })

    res.status(200).json({
      success: true,
      data: {
        tasks,
        tickets,
        inventory,
        metrics: {
          dirtyCount,
          cleaningCount,
          availableCount,
          openTicketsCount,
        },
      },
    })
  } catch (error) {
    console.error('[Housekeeping.getDashboard] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to load housekeeping dashboard.' })
  }
}

/**
 * @desc    Toggle checklist step & auto-deduct supplies
 * @route   PATCH /api/housekeeping/tasks/:id/step
 * @access  Private (Housekeeping, Admin)
 */
async function toggleChecklistStep(req, res) {
  try {
    const { id } = req.params
    const { step, value } = req.body // step: 'linen' | 'bathSalts' | 'minibar' | 'inspection'

    const task = await HousekeepingTask.findById(id).populate('room')
    if (!task) {
      return res.status(404).json({ success: false, message: 'Housekeeping task not found' })
    }

    // Update checklist step
    task.checklist[step] = Boolean(value)

    // Auto-deduct inventory if step was just marked true
    if (Boolean(value)) {
      if (step === 'linen') {
        // Deduct 1 Bed Sheet & 2 Bath Towels
        await deductInventory('Bed Sheets', 1, true)
        await deductInventory('Bath Towels', 2, true)
      } else if (step === 'bathSalts') {
        // Deduct 1 Soap & Shampoo
        await deductInventory('Soap & Shampoo', 1, false)
      } else if (step === 'minibar') {
        // Deduct 2 Water Bottles, 1 Tea/Coffee, 1 Snack
        await deductInventory('Water Bottles', 2, false)
        await deductInventory('Tea & Coffee Kits', 1, false)
        await deductInventory('Snacks', 1, false)
      }
    }

    // Evaluate overall progress
    const stepsCompleted = Object.values(task.checklist).filter(Boolean).length
    if (stepsCompleted === 4) {
      task.status = 'INSPECTED'
    } else if (stepsCompleted > 0) {
      task.status = 'IN_PROGRESS'
    } else {
      task.status = 'PENDING'
    }

    await task.save()

    // Fetch fresh inventory to return
    const freshInventory = await InventoryItem.find().sort({ category: 1, name: 1 })

    res.status(200).json({
      success: true,
      message: `Updated step ${step}`,
      data: {
        task,
        inventory: freshInventory,
      },
    })
  } catch (error) {
    console.error('[Housekeeping.toggleStep] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Certify room as clean & ready -> flips Room to AVAILABLE
 * @route   POST /api/housekeeping/tasks/:id/certify
 * @access  Private (Housekeeping, Admin)
 */
async function certifyRoom(req, res) {
  try {
    const { id } = req.params

    const task = await HousekeepingTask.findById(id).populate('room')
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' })
    }

    task.status = 'COMPLETED'
    task.completedAt = new Date()
    task.checklist = { linen: true, bathSalts: true, minibar: true, inspection: true }
    await task.save()

    // Update Room in MongoDB Atlas
    const room = await Room.findByIdAndUpdate(
      task.room._id,
      { status: 'AVAILABLE' },
      { new: true }
    )

    // Log in audit trail
    try {
      await ActivityLog.create({
        userId: req.user?._id,
        action: 'ROOM_CLEANING_CERTIFIED',
        targetId: task.room._id.toString(),
        notes: `Turnover certified for ${task.roomNumber}. Room marked AVAILABLE.`,
      })
    } catch {}

    res.status(200).json({
      success: true,
      message: `${task.roomNumber} certified and marked AVAILABLE on PMS.`,
      data: { task, room },
    })
  } catch (error) {
    console.error('[Housekeeping.certify] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Create Maintenance Ticket & Lock Room if Urgent
 * @route   POST /api/housekeeping/maintenance
 * @access  Private (Housekeeping, Receptionist, Admin)
 */
async function createMaintenanceTicket(req, res) {
  try {
    const {
      roomNumber,
      issueCategory = 'OTHER',
      issueDescription,
      priority = 'MEDIUM',
      lockRoom = true,
    } = req.body

    if (!roomNumber || !issueDescription) {
      return res.status(400).json({ success: false, message: 'Room number and issue description are required.' })
    }

    const normalized = normalizeRoomNumber(roomNumber)
    const room = await Room.findOne({ roomNumber: normalized })
    if (!room) {
      return res.status(404).json({ success: false, message: `Room ${roomNumber} not found.` })
    }

    // 1. Create Maintenance Request
    const ticket = await MaintenanceRequest.create({
      room: room._id,
      roomNumber: normalized,
      reportedBy: req.user?._id,
      reportedByName: req.user?.name || 'Staff Member',
      issueCategory,
      issueDescription,
      priority,
      status: 'REPORTED',
    })

    // 2. Lock Room in MongoDB Atlas to MAINTENANCE if specified or HIGH/URGENT
    if (lockRoom || priority === 'HIGH' || priority === 'URGENT') {
      room.status = 'MAINTENANCE'
      await room.save()
    }

    // 3. Log in Audit Trail
    try {
      await ActivityLog.create({
        userId: req.user?._id,
        action: 'MAINTENANCE_TICKET_CREATED',
        targetId: room._id.toString(),
        notes: `Maintenance ticket logged for ${normalized}: ${issueDescription}. Urgency: ${priority}.`,
      })
    } catch {}

    res.status(201).json({
      success: true,
      message: `Maintenance ticket created for ${normalized}.`,
      data: ticket,
    })
  } catch (error) {
    console.error('[Housekeeping.createTicket] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Resolve Maintenance Ticket
 * @route   PATCH /api/housekeeping/maintenance/:id/resolve
 * @access  Private (Housekeeping, Admin)
 */
async function resolveMaintenanceTicket(req, res) {
  try {
    const { id } = req.params
    const { resolutionNotes } = req.body

    const ticket = await MaintenanceRequest.findById(id).populate('room')
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' })
    }

    ticket.status = 'RESOLVED'
    ticket.resolutionNotes = resolutionNotes || 'Repairs completed and certified by engineering.'
    ticket.resolvedAt = new Date()
    await ticket.save()

    // Check if room has any other open tickets
    const remainingOpen = await MaintenanceRequest.countDocuments({
      room: ticket.room._id,
      status: { $ne: 'RESOLVED' },
    })

    // If no other open issues, return room to AVAILABLE
    if (remainingOpen === 0) {
      await Room.findByIdAndUpdate(ticket.room._id, { status: 'AVAILABLE' })
    }

    res.status(200).json({
      success: true,
      message: `Ticket for ${ticket.roomNumber} resolved.`,
      data: ticket,
    })
  } catch (error) {
    console.error('[Housekeeping.resolveTicket] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Restock Inventory Item (+10, +20, or return laundry)
 * @route   PATCH /api/housekeeping/inventory/:id/restock
 * @access  Private (Housekeeping, Admin)
 */
async function restockInventory(req, res) {
  try {
    const { id } = req.params
    const { amount = 10, type = 'clean_restock' } = req.body

    const item = await InventoryItem.findById(id)
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' })
    }

    const qty = parseInt(amount, 10) || 10

    if (type === 'laundry_return' && item.category === 'linen') {
      const returnQty = Math.min(qty, item.inLaundry)
      item.inLaundry = Math.max(0, item.inLaundry - returnQty)
      item.inStock += returnQty
    } else {
      item.inStock += qty
    }

    item.lastRestockedAt = new Date()
    await item.save()

    const allInventory = await InventoryItem.find().sort({ category: 1, name: 1 })

    res.status(200).json({
      success: true,
      message: `${item.name} stock replenished (+${qty} ${item.unit}).`,
      data: {
        item,
        inventory: allInventory,
      },
    })
  } catch (error) {
    console.error('[Housekeeping.restock] Error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Helper: Deduct stock when room is cleaned
async function deductInventory(name, count = 1, isLinen = false) {
  try {
    const item = await InventoryItem.findOne({ name })
    if (!item) return

    item.inStock = Math.max(0, item.inStock - count)
    if (isLinen) {
      item.inLaundry += count
    }
    await item.save()
  } catch (err) {
    console.warn(`[Inventory] Could not auto-deduct ${name}:`, err.message)
  }
}

// Helper: Seed default 7 items if empty
async function seedDefaultInventory() {
  const defaults = [
    { name: 'Bed Sheets', category: 'linen', inStock: 25, inLaundry: 8, minAlertLevel: 5, unit: 'sets' },
    { name: 'Bath Towels', category: 'linen', inStock: 40, inLaundry: 12, minAlertLevel: 10, unit: 'sets' },
    { name: 'Pillows & Blankets', category: 'linen', inStock: 20, inLaundry: 4, minAlertLevel: 5, unit: 'sets' },
    { name: 'Soap & Shampoo', category: 'consumable', inStock: 50, inLaundry: 0, minAlertLevel: 10, unit: 'bottles' },
    { name: 'Water Bottles', category: 'consumable', inStock: 60, inLaundry: 0, minAlertLevel: 15, unit: 'bottles' },
    { name: 'Tea & Coffee Kits', category: 'consumable', inStock: 45, inLaundry: 0, minAlertLevel: 10, unit: 'packs' },
    { name: 'Snacks', category: 'consumable', inStock: 40, inLaundry: 0, minAlertLevel: 10, unit: 'packs' },
  ]
  return await InventoryItem.insertMany(defaults)
}

module.exports = {
  getDashboard,
  toggleChecklistStep,
  certifyRoom,
  createMaintenanceTicket,
  resolveMaintenanceTicket,
  restockInventory,
}
