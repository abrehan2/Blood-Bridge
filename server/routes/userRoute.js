// IMPORTS -
const express = require("express");
const router = express.Router();
const { registerUser, verifyUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, verifyEmail } = require("../controllers/userController");
const { authenticateUser, authorizeRoles } = require("../middlewares/auth");

router.route("/auth/user/register").post(registerUser);
router.route("/:id/verify/:token").get(verifyUser);
router.route("/auth/user/login").post(loginUser);
router.route("/auth/user/logout").get(logoutUser);
router.route("/user/password/forgot").post(forgotPassword);
router.route("/user/password/reset/:token").put(resetPassword);
router.route("/user/me").get(authenticateUser, authorizeRoles("user"), getUserDetails);
router.route("/user/password/update").put(authenticateUser, authorizeRoles("user"), updatePassword);
router.route("/user/me/update").put(authenticateUser, authorizeRoles("user"), updateProfile);
router.route("/:id/email/verify/:token").get(authenticateUser, authorizeRoles("user"), verifyEmail);

module.exports = router;