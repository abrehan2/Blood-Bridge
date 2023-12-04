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
  },

  address: {
    type: String,
  },

  sector: {
    type: String,
  },

  contact: {
    type: String,
    required: [true, "Please enter your contact"],
    unique: true,
  },

  status: {
    type: String,
    enum: ["open", "close"],
    default: "close",
  },

  avatar: {
    type: String,
    required: true,
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

  profileVerified: {
    type: Boolean,
    default: false,
  },

  emailVerified: {
    type: Boolean,
    default: null,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Check if the password is already hashed -
bloodBankSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare passwords -
bloodBankSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Json web token -
bloodBankSchema.methods.getJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Reset forgot password -
bloodBankSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const bloodBankModel = mongoose.model("bloodBank", bloodBankSchema);
module.exports = bloodBankModel;
