// IMPORTS -
const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRoles } = require("../middlewares/auth");
const { createBloodRequest } = require("../controllers/bloodRequestController");

router.route("/bloodBank/blood/request").post(authenticateUser, authorizeRoles("user"), createBloodRequest);

module.exports = router;