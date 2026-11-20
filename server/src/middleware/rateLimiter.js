/**
 * Rate Limiter Middleware Factory — In-Memory Sliding Window
 * 
 * Fulfills Aptech Module 7 (Security & Access Control):
 * - Throttles brute-force password guessing and bot account spam
 * - Pure Node.js & Express (Zero bloated third-party dependencies - KISS compliant)
 * - Returns standard HTTP 429 Too Many Requests with Retry-After header
 * 
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (e.g. 15 * 60 * 1000 = 15 mins)
 * @param {number} options.max - Maximum permitted attempts within the window
 * @param {string} options.message - User-facing error message
 */
function createRateLimiter({ windowMs, max, message }) {
  const ipAttempts = new Map()

  // Periodic cleanup of stale entries every 5 minutes to prevent memory leaks
  const cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [ip, data] of ipAttempts.entries()) {
      if (now > data.resetTime) {
        ipAttempts.delete(ip)
      }
    }
  }, 5 * 60 * 1000)

  // unref timer so it does not block Node process termination in tests/scripts
  if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref()
  }

  return (req, res, next) => {
    // Determine client IP safely
    const forwarded = req.headers['x-forwarded-for']
    const ip = (forwarded ? forwarded.split(',')[0].trim() : null) || req.ip || req.socket?.remoteAddress || '127.0.0.1'
    const now = Date.now()

    const record = ipAttempts.get(ip)

    if (!record || now > record.resetTime) {
      ipAttempts.set(ip, { count: 1, resetTime: now + windowMs })
      return next()
    }

    if (record.count >= max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000))
      res.set('Retry-After', String(retryAfterSeconds))
      return res.status(429).json({
        success: false,
        message: message || `Too many attempts from this IP. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
        retryAfter: retryAfterSeconds,
      })
    }

    record.count += 1
    next()
  }
}

// Pre-configured rate limiters for authentication endpoints:
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes per IP
  message: 'Too many login attempts from this IP address. Please wait 15 minutes before trying again.',
})

const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registrations per hour per IP
  message: 'Too many account registrations from this IP address. Please try again in an hour.',
})

module.exports = {
  createRateLimiter,
  loginLimiter,
  registerLimiter,
}
