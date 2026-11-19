require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./src/config/db')

const app = express()
const PORT = process.env.PORT || 5000

// 1. Database Connection
connectDB()

// 2. Global Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// 3. API Routes
const roomRoutes = require('./src/routes/roomRoutes')
const bookingRoutes = require('./src/routes/bookingRoutes')
const staffRoutes = require('./src/routes/staffRoutes')

app.use('/api/rooms', roomRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/staff', staffRoutes)

// Health & Status Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Stayza HMS API',
    status: 'OPERATIONAL',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// 4. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// 5. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${err.stack || err.message}`)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// 6. Start HTTP Server
app.listen(PORT, () => {
  console.log(`[LuxuryStay HMS] Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
})

module.exports = app
