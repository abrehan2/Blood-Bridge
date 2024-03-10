// IMPORTS -
const dotenv = require('dotenv')
const http = require('http')
const app = require('./app')
const connectDatabase = require('./config/database')
const logger = require('./utils/winston')
const { initializeSocket } = require('./utils/location')

// CONFIG -
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({ path: './config/config.env' })
}

// PARTIALS -
const server = http.createServer(app)
initializeSocket(server)

// HANDLING UNCAUGHT EXCEPTION -
process.on('uncaughtException', (err) => {
  console.log(`ERROR: ${err.message}`)
  logger('error', err.message)
  process.exit(1)
})

// CONNECTING DATABASE -
connectDatabase()

// SETTING UP THE SERVER -
const runner = server.listen(process.env.PORT, () => {
  console.log(`SERVER IS WORKING ON PORT: ${process.env.PORT}`)
})

// UNHANDLED PROMISE REJECTION -
process.on('unhandledRejection', (err) => {
  console.log(`ERROR: ${err.message}`)
  logger('error', err.message)
  runner.close(() => process.exit(1))
})
