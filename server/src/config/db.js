const mongoose = require('mongoose')

/**
 * MongoDB Connection Utility for Stayza HMS
 * Connects via Mongoose with auto-reconnect and graceful error handling.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/luxurystay'
    
    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true, // Builds indexes in development
    })

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} / ${conn.connection.name}`)

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Error] Connection lost: ${err.message}`)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Warning] Disconnected. Re-attempting connection...')
    })

    return conn
  } catch (error) {
    console.error(`[MongoDB Error] Initial connection failure: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
