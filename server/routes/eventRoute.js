// IMPORTS -
const express = require("express");
const router = express.Router();
const {
  authenticateBloodBank,
  authorizeRoles,
  authenticateUser, 
} = require("../middlewares/auth");
const { createEvent, getAllEvents, editEvent, removeEvent, notifyUsers, getAdminEvents, getUserEvents } = require("../controllers/eventController");

// BLOOD BANK ROUTES -
router.route("/bloodBank/event/create").post(authenticateBloodBank, authorizeRoles("bloodBank"), createEvent);
router.route("/bloodBank/events/all").get(authenticateBloodBank, authorizeRoles("bloodBank"), getAllEvents);
router.route("/bloodBank/event").put(authenticateBloodBank, authorizeRoles("bloodBank"), editEvent).delete(authenticateBloodBank, authorizeRoles("bloodBank"), removeEvent);
router.route("/bloodBank/event/notify").get(authenticateBloodBank, authorizeRoles("bloodBank"), notifyUsers);
router.route("/bloodBank/events/all").get(getUserEvents);

// ADMIN ROUTES -
router.route("/admin/bloodBank/events/all").get(authenticateUser, authorizeRoles("admin"), getAdminEvents);

module.exports = router;