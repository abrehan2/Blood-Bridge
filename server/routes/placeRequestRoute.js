// IMPORTS -
const express = require("express");
const { getNearBy } = require("../controllers/placeRequestController");
const { authenticateBloodBank, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

// BLOOD BANK -
router.route("/bloodBank/action").post(authenticateBloodBank, authorizeRoles("bloodBank"), getNearBy);

module.exports = router;