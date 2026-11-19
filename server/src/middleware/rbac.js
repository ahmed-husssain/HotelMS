/**
 * Authorize Middleware — Role-Based Access Control (RBAC) Guard
 * 
 * Higher-order middleware factory that inspects req.user.role and enforces
 * access boundaries across the 4 stakeholder tiers:
 * - guest: Self-service booking and stay portal
 * - receptionist: Front desk check-in, check-out, incidental posting
 * - housekeeping: Cleaning queue and room status toggles
 * - admin: Full administrative and managerial authority
 * 
 * @param {...string} allowedRoles - Permitted roles (e.g. 'receptionist', 'admin')
 * @returns {Function} Express middleware
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    // 1. Guard against unauthenticated invocation
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to role authorization.',
      })
    }

    // 2. Verify that user role matches permitted tiers
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
      })
    }

    // 3. User is authorized
    next()
  }
}

module.exports = { authorize }
