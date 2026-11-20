const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./src/config/db')

// Security verification: enforce non-default JWT_SECRET in production
const isProduction = process.env.NODE_ENV === 'production'
const devSecret = 'luxurystay_dev_jwt_secret_2026'

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === devSecret)) {
  console.error('[FATAL SECURITY ERROR] Insecure or missing JWT_SECRET in production environment.')
  process.exit(1)
} else if (!process.env.JWT_SECRET) {
  console.warn('[SECURITY WARNING] JWT_SECRET is not set in environment. Using fallback for local dev only.')
}

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

// 1. Database Connection
connectDB()

// 2. Real-Time Socket.io Initialization
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  },
})

// Attach io to Express so any controller can access via req.app.get('io')
app.set('io', io)

// Real-Time Staff & Guest Event Routing
io.on('connection', (socket) => {
  console.log(`[Socket.io] Staff / Guest terminal connected: ${socket.id}`)

  // Support targeted room or channel subscription
  socket.on('join:channel', (channel) => {
    socket.join(channel)
    console.log(`[Socket.io] ${socket.id} joined channel: ${channel}`)
  })

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Terminal disconnected: ${socket.id}`)
  })
})

// 3. Global Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}))
app.use(express.json({
  verify: (req, res, buf) => {
    // Preserve raw buffer for cryptographic webhook HMAC SHA-256 signature verification
    req.rawBody = buf
  },
}))
app.use(express.urlencoded({ extended: true }))

// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Serverless URL normalizer for Vercel rewrites:
// When Vercel rewrites requests to server.js or api/index.js, ensure originalUrl and url
// point to the actual requested route (preserved in headers x-matched-path or x-forwarded-uri)
app.use((req, res, next) => {
  const matched = req.headers['x-matched-path'] || req.headers['x-forwarded-uri']
  if (matched && (req.url === '/server.js' || req.url.startsWith('/server.js') || req.url === '/api/index.js' || req.url.startsWith('/api/index.js'))) {
    req.url = matched
    req.originalUrl = matched
  }
  next()
})

// 4. API Routes
const authRoutes = require('./src/routes/authRoutes')
const roomRoutes = require('./src/routes/roomRoutes')
const bookingRoutes = require('./src/routes/bookingRoutes')
const staffRoutes = require('./src/routes/staffRoutes')
const housekeepingRoutes = require('./src/routes/housekeepingRoutes')
const adminRoutes = require('./src/routes/adminRoutes')
const paymentRoutes = require('./src/routes/paymentRoutes')

// Welcome & Healthcheck Endpoints
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Stayza Hotel Management System API is live on Vercel',
    version: '1.0.0',
    database: 'MongoDB Atlas Connected',
    status: 'OPERATIONAL',
    endpoints: {
      auth: '/api/auth',
      rooms: '/api/rooms',
      bookings: '/api/bookings',
      staff: '/api/staff',
      housekeeping: '/api/housekeeping',
      admin: '/api/admin',
      payments: '/api/payments',
      health: '/api/health',
    },
    timestamp: new Date().toISOString(),
  })
})

app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Stayza HMS API',
    status: 'OPERATIONAL',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

app.use(['/api/auth', '/auth'], authRoutes)
app.use(['/api/rooms', '/rooms'], roomRoutes)
app.use(['/api/bookings', '/bookings'], bookingRoutes)
app.use(['/api/staff', '/staff'], staffRoutes)
app.use(['/api/housekeeping', '/housekeeping'], housekeepingRoutes)
app.use(['/api/admin', '/admin'], adminRoutes)
app.use(['/api/payments', '/payments'], paymentRoutes)


// 5. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// 6. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${err.stack || err.message}`)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// 7. Start HTTP Server with WebSockets (Standalone container / local mode)
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`[Stayza HMS] Server listening on port ${PORT} with Socket.io in ${process.env.NODE_ENV || 'development'} mode`)
  })
}

// Export Express app directly for Vercel Serverless Functions
app.server = server
app.io = io
module.exports = app
