// IMPORTS -
const express = require("express");
const { getNearBy } = require("../controllers/placeRequestController");
const { authenticateBloodBank, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/bloodBank/action").get(authenticateBloodBank, authorizeRoles("bloodBank"), getNearBy);


module.exports = router;