// IMPORTS -
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Please enter your review"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  bloodBank: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodBank",
    required: true,
  },

  bloodRequest: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodRequest",
  },

  bloodDonation: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodDonation",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reviewModel = mongoose.model("review", reviewSchema);
module.exports = reviewModel;
