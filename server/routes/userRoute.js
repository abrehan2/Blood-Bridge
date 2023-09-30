// IMPORTS -
const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");
const { authenticate, authorizeRoles } = require("../middlewares/auth");

router.route("/register").post(registerUser);

module.exports = router;