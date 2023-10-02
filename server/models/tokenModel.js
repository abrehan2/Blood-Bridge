// IMPORTS -
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    unique: true,
  },

  BloodBankId: {
    type: mongoose.Schema.ObjectId,
    ref: "Blood Bank",
    unique: true,
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

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
