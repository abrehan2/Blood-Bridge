// IMPORTS -
const express = require("express");
const router = express.Router();
const { authenticateBloodBank, authorizeRoles, authenticateUser } = require("../middlewares/auth");
const { createBloodDonation, getBloodDonations } = require("../controllers/bloodDonationController");

// USER -
router.route("/bloodBank/blood/donation").post(authenticateUser, authorizeRoles("user"), createBloodDonation);

// BLOOD BANK -
router.route("/bloodBank/blood/donation/all").get(authenticateBloodBank, authorizeRoles("bloodBank"), getBloodDonations);

module.exports = router;