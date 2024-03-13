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


// // FOR DEPLOYMENT -
// app.get("/", (req, res) => {
//   res.send("<h1>Processing</h1>");
// });

module.exports = app
