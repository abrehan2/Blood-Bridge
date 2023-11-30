// IMPORTS -
const mongoose = require("mongoose");

const bloodDonationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },

  contact: {
    type: String,
    required: [true, "Please enter your contact"],
  },

  age: {
    type: String,
    required: [true, "Please enter your age"],
  },

  bloodBank: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodBank",
    required: true,
  },

  bloodGroup: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodGroup",
    required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  disease: {
    type: String,
    required: [
      true,
      "Please enter your disease, if any, prior to blood donation",
    ],
  },

  donationDate: {
    type: Date,
    required: [
      true,
      "Please select the date you would like to schedule your blood donation",
    ],
  },

  donationStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Completed", "Rejected"],
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bloodDonationSchema.index({ contact: 1 });

const bloodDonationModel = mongoose.model("bloodDonation", bloodDonationSchema);

module.exports = bloodDonationModel;
