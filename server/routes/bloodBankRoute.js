// IMPORTS -
const express = require("express");
const router = express.Router();
const {
  registerBloodBank,
  verifyBloodBank,
  loginBloodBank,
  logoutBloodBank,
} = require("../controllers/bloodBankController");
const { authenticate, authorizeRoles } = require("../middlewares/auth");

router.route("/auth/bloodBank/register").post(registerBloodBank);
router.route("/bloodBank/:id/verify/:token").get(verifyBloodBank);
router.route("/auth/bloodBank/login").post(loginBloodBank);
router.route("/auth/bloodBank/logout").get(logoutBloodBank);

module.exports = router;
