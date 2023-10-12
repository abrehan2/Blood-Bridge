// IMPORTS -
const mongoose = require("mongoose");

const updateEmailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    
  },

  BloodBankId: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodBank",
  },

  token: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // 1 hour
  },
});

const updateEmail = mongoose.model("updateEmail", updateEmailSchema);
module.exports = updateEmail;
