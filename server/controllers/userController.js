// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");
const setToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

// REGISTER USER -
exports.registerUser = catchAsyncErr(async (req, res, next) => {
  const { firstName, lastName, email, cnic, city, dob, password } = req.body;

  let user = await userModel.findOne({ email });

  if (user) {
    return next(
      new ErrorHandler("The email address you entered is already in use", 409)
    );
  } else {
    user = await userModel.create({
      firstName,
      lastName,
      email,
      cnic,
      city,
      dob,
      password,
    });

    const token = await new tokenModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}/${user.id}/verify/${token.token}`;

    await sendEmail({
      email: user.email,
      subject: "Blood Bridge Email Verification",
      message: `Click the given link to verify your account: ${url}`,
    });

    res.status(201).json({
      success: true,
      message:
        "Your account has been created! Please verify your email address to log in",
    });
  }
});

// VERIFY USER -
exports.verifyUser = catchAsyncErr(async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.params.id });

  if (!user) {
    return next(new ErrorHandler("Invalid email verification link", 400));
  }

  const token = await tokenModel.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!token) {
    return next(new ErrorHandler("Invalid email verification link", 400));
  }

  await userModel.updateOne({ _id: user._id, verified: true });
  await token.deleteOne();

  res.status(200).json({
    success: true,
    message: "Thank you for verifying your email address",
  });
});

// LOGIN USER -
