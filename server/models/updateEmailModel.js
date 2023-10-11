// IMPORTS -
const mongoose = require("mongoose");

const updateEmailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
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

const updateEmail = mongoose.model("Update Email", updateEmailSchema);
module.exports = updateEmail;
