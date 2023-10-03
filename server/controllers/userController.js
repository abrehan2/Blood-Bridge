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
    z;
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
exports.loginUser = catchAsyncErr(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter the email and password", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Your email or password is incorrect", 401));
  }

  if (!user.verified) {
    let token = await tokenModel.findOne({ userId: user._id });

    if (!token) {
      token = await new tokenModel({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url = `${process.env.BASE_URL}/${user.id}/verify/${token.token}`;

      await sendEmail({
        email: user.email,
        subject: "Blood Bridge Email Verification",
        message: `Click the given link to verify your account: ${url}`,
      });
    }
    return next(
      new ErrorHandler(
        "Activate your account by clicking the link in the email",
        400
      )
    );
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Your email or password is incorrect", 401));
  }
  setToken(user, 200, res);
});

// LOGOUT -
exports.logoutUser = catchAsyncErr(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "You have been logged out of your account",
  });
});

// GENERATE TOKEN FOR FORGOT PASSWORD -
exports.forgotPassword = catchAsyncErr(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please enter the email", 400));
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const url = `${process.env.BASE_URL}/password/reset/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Blood Bridge password reset verification",
      message: `Click the given link to change your password: ${url}`,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
});
