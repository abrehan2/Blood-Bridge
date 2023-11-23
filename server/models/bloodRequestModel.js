// IMPORTS -
const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },

  contact: {
    type: String,
    required: [true, "Please enter your contact"],
    unique: true,
  },

  bloodBank: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodBank",
    required: [true, "Please select the blood bank"],
  },

  bloodGroup: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodGroup",
    required: [true, "Please select the blood type"],
  },

  bloodBags: {
    type: Number,
    default: 1,
    required: [true, "Please enter the number of blood bags"],
  },

  bloodNeededOn: {
    type: Date,
    required: [true, "Please enter the date you will need the blood bags"],
  },

  reqStatus: {
    type: String,
    required: true,
    enum: ["Pending", "Accepted", "Rejected"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bloodRequestModel = mongoose.model("bloodRequest", bloodRequestSchema);
module.exports = bloodRequestModel;
