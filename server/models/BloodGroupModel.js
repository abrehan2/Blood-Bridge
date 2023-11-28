// IMPORTS -
const mongoose = require("mongoose");

const bloodGroupSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: [true, "Please select the blood type"],
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },

  stock: {
    type: Number,
    required: [true, "Please enter the blood type stock"],
    max: [1000, "Stock cannot exceed 1000 units"],
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

bloodGroupSchema.index({ bloodGroup: 1, bloodBank: 1 }, { unique: true });

const bloodGroup = mongoose.model("bloodGroup", bloodGroupSchema);
module.exports = bloodGroup;