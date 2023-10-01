// IMPORTS -
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const bloodBankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name of your blood bank"],
    maxLength: [
      30,
      "Please keep your blood bank name to 30 characters or less",
    ],
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validator: [validator.isEmail, "Please enter a valid email address"],
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Your password must be at least 8 characters long"],
    select: false,
  },

  licenseNo: {
    type: Number,
    required: [true, "Please enter your license number"],
    unique: true,
  },

  city: {
    type: String,
    required: [true, "Please enter your city"],
  },

  address: {
    type: String,
    required: [true, "Please enter your address"],
  },

  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },

  role: {
    type: String,
    default: "bloodBank",
  },

  verified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
