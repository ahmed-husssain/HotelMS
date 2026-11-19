const express = require('express')
const router = express.Router()
const {
  getDashboard,
  toggleChecklistStep,
  certifyRoom,
  createMaintenanceTicket,
  resolveMaintenanceTicket,
  restockInventory,
} = require('../controllers/housekeepingController')
const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/rbac')

/**
 * LuxuryStay / Stayza — Housekeeping, Maintenance & Supplies Routes (Doc TRD 2.7 & 2.8)
 * 
 * Cryptographically secured with JWT verification (protect) and RBAC.
 * Operational data is synchronized directly with MongoDB Atlas.
 */
router.use(protect)

// Housekeeping & Operations Overview Board
router.get('/dashboard', authorize('housekeeping', 'receptionist', 'admin'), getDashboard)

// Update 4-Point Turnover Checklist Step (auto-deducts supplies)
router.patch('/tasks/:id/step', authorize('housekeeping', 'admin'), toggleChecklistStep)

// Certify Room Turnover Complete (marks Room AVAILABLE in MongoDB Atlas)
router.post('/tasks/:id/certify', authorize('housekeeping', 'admin'), certifyRoom)

// Report Maintenance Defect & Atomically Lock Room
router.post('/maintenance', authorize('housekeeping', 'receptionist', 'admin'), createMaintenanceTicket)

// Resolve Maintenance Defect (unfreezes Room to AVAILABLE)
router.patch('/maintenance/:id/resolve', authorize('housekeeping', 'admin'), resolveMaintenanceTicket)

// Restock Everyday Hotel Supplies / Linens
router.patch('/inventory/:id/restock', authorize('housekeeping', 'admin'), restockInventory)

module.exports = router
