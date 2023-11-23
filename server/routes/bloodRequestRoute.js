// IMPORTS -
const express = require("express");
const router = express.Router();
const { authenticateBloodBank, authorizeRoles } = require("../middlewares/auth");
const { createBloodRequest } = require("../controllers/bloodRequestController");

router.route("/bloodBank/blood/request").post(authenticateBloodBank, authorizeRoles("bloodBank"), createBloodRequest);

module.exports = router;