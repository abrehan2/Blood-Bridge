// IMPORTS -
const express = require('express')
const app = express()
const dotenv = require('dotenv')

// CONFIG -
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({ path: './config/config.env' })
}

// CALLING THE STARTUP FUNCTION -
require('./start/routes')(app)

module.exports = app
