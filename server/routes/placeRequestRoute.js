// IMPORTS -
const express = require('express')
const {
  getNearBy,
  getNearBloodBanks,
  getRecords,
} = require('../controllers/placeRequestController')
const { authenticateBloodBank, authorizeRoles } = require('../middlewares/auth')
const router = express.Router()

// BLOOD BANK -
router
  .route('/bloodBank/action')
  .post(authenticateBloodBank, authorizeRoles('bloodBank'), getNearBy)

router
  .route('/bloodBanks')
  .get(authenticateBloodBank, authorizeRoles('bloodBank'), getNearBloodBanks)

router
  .route('/bloodBanks/records')
  .get(authenticateBloodBank, authorizeRoles('bloodBank'), getRecords)

module.exports = router
