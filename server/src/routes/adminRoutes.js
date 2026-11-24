const express = require('express')
const router = express.Router()
const {
  getExecutiveAnalytics,
  getStaffAccounts,
  createStaffAccount,
  toggleStaffStatus,
  updateStaffAccount,
  deleteStaffAccount,
  getGuestDirectory,
  updateRoomRate,
  getAuditLogs,
} = require('../controllers/adminController')
const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/rbac')

/**
 * LuxuryStay / Stayza HMS — Admin Routes (/api/admin)
 * 
 * Strictly secured with cryptographic JWT authentication (protect)
 * and General Manager Role-Based Access Control (authorize('admin')).
 * Rejects non-admin users with HTTP 403 Forbidden.
 */
router.use(protect)
router.use(authorize('admin'))

// 1. Executive Analytics (5 Real Metrics)
router.get('/analytics', getExecutiveAnalytics)

// 2. Staff Governance (Full CRUD)
router.get('/staff', getStaffAccounts)
router.post('/staff', createStaffAccount)
router.put('/staff/:id', updateStaffAccount)
router.patch('/staff/:id/status', toggleStaffStatus)
router.delete('/staff/:id', deleteStaffAccount)

// 3. Guest CRM & Directory
router.get('/guests', getGuestDirectory)

// 4. Dynamic Room Tariffs
router.patch('/rooms/:id/rate', updateRoomRate)

// 5. Central Activity Audit Trail
router.get('/audit-logs', getAuditLogs)

module.exports = router
