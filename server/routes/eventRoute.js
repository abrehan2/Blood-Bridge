// IMPORTS -
const express = require("express");
const router = express.Router();
const {
  authenticateBloodBank,
  authorizeRoles, 
} = require("../middlewares/auth");
const { createEvent, getAllEvents, editEvent, removeEvent } = require("../controllers/eventController");

// BLOOD BANK ROUTES -
router.route("/bloodBank/event/create").post(authenticateBloodBank, authorizeRoles("bloodBank"), createEvent);
router.route("/bloodBank/events/all").get(authenticateBloodBank, authorizeRoles("bloodBank"), getAllEvents);
router.route("/bloodBank/event").put(authenticateBloodBank, authorizeRoles("bloodBank"), editEvent).delete(authenticateBloodBank, authorizeRoles("bloodBank"), removeEvent);

module.exports = router;