// IMPORTS -
const express = require("express");
const router = express.Router();
const {
  registerBloodBank,
  verifyBloodBank,
  loginBloodBank,
  logoutBloodBank,
  forgotPassword,
  resetPassword, 
  getBloodBank,
  updatePassword,
  updateProfile,
  verifyEmail,
  resendEmailVerification,
} = require("../controllers/bloodBankController");
const { authenticateBloodBank, authorizeRoles } = require("../middlewares/auth");
const { createBloodType } = require("../controllers/bloodGroupController");

router.route("/auth/bloodBank/register").post(registerBloodBank);
router.route("/auth/bloodBank/:id/verify/:token").get(verifyBloodBank);
router.route("/auth/bloodBank/login").post(loginBloodBank);
router.route("/auth/bloodBank/logout").get(logoutBloodBank);
router.route("/auth/bloodBank/forgot").post(forgotPassword);
router.route("/auth/bloodBank/reset/:token").put(resetPassword);
router.route("/bloodBank/me").get(authenticateBloodBank, authorizeRoles("bloodBank"), getBloodBank);
router.route("/bloodBank/password/update").put(authenticateBloodBank, authorizeRoles("bloodBank"), updatePassword);
router.route("/bloodBank/me/update").put(authenticateBloodBank, authorizeRoles("bloodBank"), updateProfile);
router.route("/bloodBank/:id/verify/:token").get(verifyEmail);
router.route("/bloodBank/email/resend").get(authenticateBloodBank, authorizeRoles("bloodBank"),resendEmailVerification)
router.route("/bloodBank/bloodType/new").post(authenticateBloodBank, authorizeRoles("bloodBank"), createBloodType);

module.exports = router;
