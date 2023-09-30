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

  let user = await userModel.findOne({email});
 
  if (user) {
    return next(
      new ErrorHandler("The email address you entered is already in use", 409)
    );
  }

  else {
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
