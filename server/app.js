// IMPORTS -
const express = require('express')
const app = express()
const dotenv = require('dotenv')

// CALLING THE STARTUP FUNCTION -
require('./start/routes')(app)

// CONFIG -
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({ path: './config/config.env' })
}

// // FOR DEPLOYMENT -
// app.get("/", (req, res) => {
//   res.send("<h1>Processing</h1>");
// });

module.exports = app
