// IMPORTS -
const express = require('express')
const router = express.Router()
const { authenticateBloodBank, authorizeRoles, authenticateUser } = require('../middlewares/auth')
const {
  createBloodType,
  getAllBloodTypes,
  updateBloodType,
  removeBloodType,
  getUserBloodTypes,
} = require('../controllers/bloodGroupController')

// BLOOD BANK -
router
  .route('/bloodBank/bloodType/new')
  .post(authenticateBloodBank, authorizeRoles('bloodBank'), createBloodType)
router
  .route('/bloodBank/bloodType/all')
  .get(authenticateBloodBank, authorizeRoles('bloodBank'), getAllBloodTypes)
router
  .route('/bloodBank/bloodType/update')
  .put(authenticateBloodBank, authorizeRoles('bloodBank'), updateBloodType)
router
  .route('/bloodBank/bloodType/delete')
  .delete(authenticateBloodBank, authorizeRoles('bloodBank'), removeBloodType)

module.exports = router
