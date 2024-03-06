// IMPORTS -
const express = require('express')
const router = express.Router()
const { authenticateUser, authenticateBloodBank, authorizeRoles } = require('../middlewares/auth')
const {
  createBloodRequest,
  getBloodRequests,
  getUserBloodRequests,
  updateRequestStatus,
  manualRequest,
} = require('../controllers/bloodRequestController')

// USER -
router
  .route('/bloodBank/blood/request')
  .post(authenticateUser, authorizeRoles('user'), createBloodRequest)
router
  .route('/user/blood/request/all')
  .get(authenticateUser, authorizeRoles('user'), getUserBloodRequests)

// BLOOD BANK -
router
  .route('/bloodBank/blood/request/all')
  .get(authenticateBloodBank, authorizeRoles('bloodBank'), getBloodRequests)
router
  .route('/bloodBank/blood/request/:id')
  .put(authenticateBloodBank, authorizeRoles('bloodBank'), updateRequestStatus)
router
  .route('/bloodBank/blood/manualRequest')
  .post(authenticateBloodBank, authorizeRoles('bloodBank'), manualRequest)

module.exports = router
