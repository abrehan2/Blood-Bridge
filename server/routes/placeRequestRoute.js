// IMPORTS -
const express = require('express')
const { getNearBy, getNearBloodBanks } = require('../controllers/placeRequestController')
const { authenticateBloodBank, authorizeRoles } = require('../middlewares/auth')
const router = express.Router()

// BLOOD BANK -
router
  .route('/bloodBank/action')
  .post(authenticateBloodBank, authorizeRoles('bloodBank'), getNearBy)

  router
  .route('/bloodBanks')
  .get(authenticateBloodBank, authorizeRoles('bloodBank'), getNearBloodBanks) 

module.exports = router
  