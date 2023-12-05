// IMPORTS -
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    maxLength: [30, "Please keep your first name to 30 characters or less"],
  },

  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
    maxLength: [30, "Please keep your last name to 30 characters or less"],
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

  dob: {
    type: Date,
    required: [true, "Please enter your date of birth"],
  },

  city: {
    type: String,
    required: [true, "Please enter your city"],
  },

  cnic: {
    type: String,
    required: [true, "Please enter your cnic"],
    unique: true,
  },

  contact: {
    type: String,
    required: [true, "Please enter your contact"],
    unique: true,
  },

  bloodGroup: {
    type: String,
    required: [true, "Please enter your blood group"],
  },

  avatar: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  verified: {
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

  block: {
    type: Boolean,
    default: false,
  },

  feedback: [
    {
      type: String,
      required: [true, "Please enter your feedback"],
      maxLength: [200, "Please keep your response to 200 words or less"],
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the password is already hashed -
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare passwords -
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Json web token -
userSchema.methods.getJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Reset forgot password -
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
