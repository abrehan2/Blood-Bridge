// IMPORTS -
const express = require("express");
const router = express.Router();
const { authenticateBloodBank, authorizeRoles, authenticateUser } = require("../middlewares/auth");
const { createBloodDonation } = require("../controllers/bloodDonationController");

// USER -
router.route("/bloodBank/blood/donation").post(authenticateUser, authorizeRoles("user"), createBloodDonation);



module.exports = router;