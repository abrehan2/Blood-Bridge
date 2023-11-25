// IMPORTS -
const express = require("express");
const router = express.Router();
const { authenticateUser, authenticateBloodBank, authorizeRoles } = require("../middlewares/auth");
const { createBloodRequest, getBloodRequests } = require("../controllers/bloodRequestController");

// USER -
router.route("/bloodBank/blood/request").post(authenticateUser, authorizeRoles("user"), createBloodRequest);

// BLOOD BANK -
router.route("/bloodBank/blood/request/all").get(authenticateBloodBank, authorizeRoles("bloodBank"), getBloodRequests);
module.exports = router;