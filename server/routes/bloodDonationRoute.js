// IMPORTS -
const express = require("express");
const router = express.Router();
const { authenticateBloodBank, authorizeRoles, authenticateUser } = require("../middlewares/auth");
const { createBloodDonation, getBloodDonations, getUserBloodDonations, updateDonationStatus, manualDonation } = require("../controllers/bloodDonationController");

// USER -
router.route("/bloodBank/blood/donation").post(authenticateUser, authorizeRoles("user"), createBloodDonation);
router.route("/user/blood/donation/all").get(authenticateUser, authorizeRoles("user"), getUserBloodDonations);

// BLOOD BANK -
router.route("/bloodBank/blood/donation/all").get(authenticateBloodBank, authorizeRoles("bloodBank"), getBloodDonations);
router.route("/bloodBank/blood/donation/:id").put(authenticateBloodBank, authorizeRoles("bloodBank"), updateDonationStatus);
router.route("/bloodBank/blood/manualDonation").post(authenticateBloodBank, authorizeRoles("bloodBank"), manualDonation);

module.exports = router;