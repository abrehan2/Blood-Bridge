// IMPORTS -
const mongoose = require("mongoose");

const bloodGroupSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: [true, "Select the blood type"],
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  },

  stock: {
    type: Number,
    required: [true, "Please enter the blood group stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 0,
  },

  bloodBank: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodBank",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bloodGroup = mongoose.model("bloodGroup", bloodGroupSchema);
module.exports = bloodGroup;