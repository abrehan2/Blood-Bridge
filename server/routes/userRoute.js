// IMPORTS -
const express = require("express");
const router = express.Router();
const { registerUser, verifyUser, loginUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, verifyEmail, resendEmailVerification, userFeedBack, getUserLocation, deactivateAccount, getBloodBanks, getAllUsers, viewUser, reviewBloodBank, blockUser, deleteUser, getAllReviews, deleteReview, viewBloodBank } = require("../controllers/userController");
const { authenticateUser, authorizeRoles } = require("../middlewares/auth");


// USER ROUTES -
router.route("/auth/user/register").post(registerUser);
router.route("/auth/user/:id/verify/:token").get(verifyUser);
router.route("/auth/user/login").post(loginUser);
// router.route("/auth/user/logout").get(logoutUser);
router.route("/auth/user/forgot").post(forgotPassword);
router.route("/auth/user/reset/:token").put(resetPassword);
router.route("/user/me").get(authenticateUser, authorizeRoles("user", "admin"), getUserDetails);
router.route("/user/password/update").put(authenticateUser, authorizeRoles("user", "admin"), updatePassword);
router.route("/user/me/update").put(authenticateUser, authorizeRoles("user", "admin"), updateProfile);
router.route("/user/:id/verify/:token").get(verifyEmail);
router.route("/user/email/resend").get(authenticateUser, authorizeRoles("user", "admin"), resendEmailVerification);
router.route("/user/feedback").post(authenticateUser, authorizeRoles("user"), userFeedBack);
router.route("/user/location").get(authenticateUser,  authorizeRoles("user"), getUserLocation);
router.route("/user/deactivate").put(authenticateUser, authorizeRoles("user", "admin"), deactivateAccount);
router.route("/user/bloodBanks/all").get(authenticateUser, authorizeRoles("user"), getBloodBanks);
router.route("/user/review/bloodBank").post(authenticateUser, authorizeRoles("user"), reviewBloodBank);
router.route("/user/bloodBank/:id").get(authenticateUser, authorizeRoles("user"), viewBloodBank);

// ADMIN ROUTES -
router.route("/admin/user/all").get(authenticateUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(authenticateUser, authorizeRoles("admin"), viewUser)
  .put(authenticateUser, authorizeRoles("admin"), blockUser)
  .delete(authenticateUser, authorizeRoles("admin"), deleteUser);
  router.route("/admin/reviews").get(authenticateUser, authorizeRoles("admin"), getAllReviews);
router.route("/admin/review/:id").delete(authenticateUser, authorizeRoles("admin"), deleteReview);

module.exports = router;