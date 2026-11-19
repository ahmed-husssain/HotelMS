const mongoose = require('mongoose')

/**
 * MongoDB Connection Utility for Stayza HMS
 * Connects via Mongoose with auto-reconnect, exponential backoff, and graceful error handling.
 */
const connectDB = async (retries = 3, delay = 2000) => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/luxurystay'

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoURI, {
        autoIndex: true,
        serverSelectionTimeoutMS: 8000,
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
      console.warn(`[MongoDB Warning] Connection attempt ${attempt}/${retries} failed: ${error.message}`)
      if (attempt < retries) {
        console.log(`[MongoDB] Retrying in ${delay / 1000}s...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        console.error(`[MongoDB Error] All connection attempts exhausted: ${error.message}`)
        // Do not crash the entire process; allow Express to handle HTTP requests gracefully
      }
    }
  }
}

module.exports = connectDB
