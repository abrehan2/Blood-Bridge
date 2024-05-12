// IMPORTS -
const express = require('express')
const router = express.Router()
const {
  registerBloodBank,
  verifyBloodBank,
  loginBloodBank,
  forgotPassword,
  resetPassword,
  getBloodBank,
  updatePassword,
  updateProfile,
  verifyEmail,
  resendEmailVerification,
  completeProfile,
  deactivateAccount,
  getAllBloodBanks,
  getAllReviews,
  viewBloodBank,
  blockBloodBank,
  deleteBloodBank,
  getBloodRequests,
  getBloodDonations,
  updateAccountStatus,
  getBloodBanksForCards,
} = require('../controllers/bloodBankController')
const { authenticateBloodBank, authorizeRoles, authenticateUser } = require('../middlewares/auth')

// BLOOD BANK ROUTES -
router.route('/auth/bloodBank/register').post(registerBloodBank)
router.route('/auth/bloodBank/:id/verify/:token').get(verifyBloodBank)
router.route('/auth/bloodBank/login').post(loginBloodBank)
router.route('/auth/bloodBank/forgot').post(forgotPassword)
router.route('/auth/bloodBank/reset/:token').put(resetPassword)
router
  .route('/bloodBank/profileCompletion')
  .post(authenticateBloodBank, authorizeRoles('bloodBank'), completeProfile)
router.route('/bloodBank/me').get(authenticateBloodBank, authorizeRoles('bloodBank'), getBloodBank)
router
  .route('/bloodBank/password/update')
  .put(authenticateBloodBank, authorizeRoles('bloodBank'), updatePassword)
router
  .route('/bloodBank/me/update')
  .put(authenticateBloodBank, authorizeRoles('bloodBank'), updateProfile)
router.route('/bloodBank/:id/verify/:token').get(verifyEmail)
router
  .route('/bloodBank/email/resend')
  .get(authenticateBloodBank, authorizeRoles('bloodBank'), resendEmailVerification)
router
  .route('/bloodBank/deactivate')
  .put(authenticateBloodBank, authorizeRoles('bloodBank'), deactivateAccount)
router
  .route('/bloodBank/reviews')
  .get(authenticateBloodBank, authorizeRoles('bloodBank'), getAllReviews)

  router.route('/bloodBanks').get(getBloodBanksForCards);

// ADMIN ROUTES -
router
  .route('/admin/bloodBank/all')
  .get(authenticateUser, authorizeRoles('admin'), getAllBloodBanks)
router
  .route('/admin/bloodBank/:id')
  .get(authenticateUser, authorizeRoles('admin'), viewBloodBank)
  .put(authenticateUser, authorizeRoles('admin'), blockBloodBank)
  .delete(authenticateUser, authorizeRoles('admin'), deleteBloodBank)
router
  .route('/admin/bloodBank/verification/:id')
  .put(authenticateUser, authorizeRoles('admin'), updateAccountStatus)
router
  .route('/admin/bloodBank/blood/requests')
  .get(authenticateUser, authorizeRoles('admin'), getBloodRequests)
router
  .route('/admin/bloodBank/blood/donations')
  .get(authenticateUser, authorizeRoles('admin'), getBloodDonations)

module.exports = router
