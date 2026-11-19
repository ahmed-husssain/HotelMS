const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./src/config/db')

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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// 4. API Routes
const authRoutes = require('./src/routes/authRoutes')
const roomRoutes = require('./src/routes/roomRoutes')
const bookingRoutes = require('./src/routes/bookingRoutes')
const staffRoutes = require('./src/routes/staffRoutes')
const housekeepingRoutes = require('./src/routes/housekeepingRoutes')
const adminRoutes = require('./src/routes/adminRoutes')
const housekeepingRoutes = require('./src/routes/housekeepingRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/housekeeping', housekeepingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/housekeeping', housekeepingRoutes)

// Health & Status Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Stayza HMS API',
    status: 'OPERATIONAL',
    socketio: 'ENABLED',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

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

// 7. Start HTTP Server with WebSockets
server.listen(PORT, () => {
  console.log(`[Stayza HMS] Server listening on port ${PORT} with Socket.io in ${process.env.NODE_ENV || 'development'} mode`)
})

module.exports = { app, server, io }
