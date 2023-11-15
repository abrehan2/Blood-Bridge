// IMPORTS -
const express = require("express");
const router = express.Router();
const { registerUser, verifyUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, verifyEmail, resendEmailVerification, userFeedBack, getUserLocation } = require("../controllers/userController");
const { authenticateUser, authorizeRoles } = require("../middlewares/auth");

router.route("/auth/user/register").post(registerUser);
router.route("/auth/user/:id/verify/:token").get(verifyUser);
router.route("/auth/user/login").post(loginUser);
router.route("/auth/user/logout").get(logoutUser);
router.route("/auth/user/forgot").post(forgotPassword);
router.route("/auth/user/reset/:token").put(resetPassword);
router.route("/user/me").get(authenticateUser, authorizeRoles("user"), getUserDetails);
router.route("/user/password/update").put(authenticateUser, authorizeRoles("user"), updatePassword);
router.route("/user/me/update").put(authenticateUser, authorizeRoles("user"), updateProfile);
router.route("/user/:id/verify/:token").get(verifyEmail);
router.route("/user/email/resend").get(authenticateUser, authorizeRoles("user"), resendEmailVerification);
router.route("/user/feedback").post(authenticateUser, authorizeRoles("user"), userFeedBack);

module.exports = router;