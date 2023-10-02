// IMPORTS -
const express = require("express");
const router = express.Router();
const { registerUser, verifyUser, loginUser, logoutUser } = require("../controllers/userController");
const { authenticate, authorizeRoles } = require("../middlewares/auth");

router.route("/auth/user/register").post(registerUser);
router.route("/:id/verify/:token").get(verifyUser);
router.route("/auth/user/login").post(loginUser);
router.route("/auth/user/logout").get(logoutUser);

module.exports = router;