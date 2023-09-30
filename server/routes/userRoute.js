// IMPORTS -
const express = require("express");
const router = express.Router();
const { registerUser, verifyUser } = require("../controllers/userController");
const { authenticate, authorizeRoles } = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/:id/verify/:token").get(verifyUser);

module.exports = router;