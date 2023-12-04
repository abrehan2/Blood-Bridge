// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodBankModel = require("../models/bloodBankModel");
const verificationModel = require("../models/verificationModel");
const setToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const parseLocation = require("../utils/getIp");

// PARTIALS -
const imageBuffer =
  "https://utfs.io/f/d7cfaa2b-ee7b-47eb-8963-1f41ab93b88f-nest39.webp";

// REGISTER A BLOOD BANK -
exports.registerBloodBank = catchAsyncErr(async (req, res, next) => {
  const { name, email, password, licenseNo, contact } = req.body;

  let bloodBank = await bloodBankModel.findOne({ email });

  if (bloodBank) {
    return next(
      new ErrorHandler("The email address you entered is already in use", 409)
    );
  }

  bloodBank = await bloodBankModel.create({
    name,
    email,
    password,
    licenseNo,
    contact,
    avatar: imageBuffer,
  });

  const token = await new verificationModel({
    BloodBankId: bloodBank._id,
    token: crypto.randomBytes(32).toString("hex"),
    purpose: "accountVerify",
  }).save();

  const url = `${process.env.BASE_URL}/auth/bloodBank/${bloodBank.id}/verify/${token.token}`;

  await sendEmail({
    email: bloodBank.email,
    subject: "Blood Bridge Account Verification",
    message: `Click the given link to verify your account: ${url}`,
  });

  res.status(201).json({
    success: true,
    message:
      "Your account has been created! Please verify your email address to log in",
  });
});

// VERIFY BLOOD BANK -
exports.verifyBloodBank = catchAsyncErr(async (req, res, next) => {
  const bloodBank = await bloodBankModel.findOne({ _id: req.params.id });

  if (!bloodBank) {
    return next(new ErrorHandler("Invalid email verification link", 400));
  }

  const token = await verificationModel.findOne({
    BloodBankId: bloodBank._id,
    token: req.params.token,
  });

  if (!token) {
    return next(new ErrorHandler("Invalid email verification link", 400));
  }

  await bloodBank.updateOne({ verified: true });
  await token.deleteOne();

  res.status(200).json({
    success: true,
    message: "Thank you for verifying your email address",
  });
});

// LOGIN BLOOD BANK -
exports.loginBloodBank = catchAsyncErr(async (req, res, next) => {
  const { licenseNo, password } = req.body;

  if (!licenseNo || !password) {
    return next(
      new ErrorHandler("Please enter the license number and password", 400)
    );
  }

  const bloodBank = await bloodBankModel
    .findOne({ licenseNo })
    .select("+password");

  if (!bloodBank) {
    return next(
      new ErrorHandler("Your license number or password is incorrect", 401)
    );
  }

  if (bloodBank.isActive === false) {
    bloodBank.isActive = true;
  }

  if (!bloodBank.verified) {
    let token = await verificationModel.findOne({ BloodBankId: bloodBank._id });

    if (!token) {
      token = await new verificationModel({
        BloodBankId: bloodBank._id,
        token: crypto.randomBytes(32).toString("hex"),
        purpose: "accountVerify",
      }).save();

      const url = `${process.env.BASE_URL}/auth/bloodBank/${bloodBank.id}/verify/${token.token}`;

      await sendEmail({
        email: bloodBank.email,
        subject: "Blood Bridge Account Verification",
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

  const isPasswordMatched = await bloodBank.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("Your license number or password is incorrect", 401)
    );
  }

  await bloodBank.save({ validateBeforeSave: true });
  setToken(bloodBank, 200, res);
});

// LOGOUT BLOOD BANK-
exports.logoutBloodBank = catchAsyncErr(async (req, res, next) => {
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

  const bloodBank = await bloodBankModel.findOne({ email });

  if (!bloodBank) {
    return next(new ErrorHandler("Blood bank not found", 404));
  }

  const resetToken = bloodBank.getResetPasswordToken();
  await bloodBank.save({ validateBeforeSave: false });

  const url = `${process.env.BASE_URL}/auth/bloodBank/reset/${resetToken}`;

  try {
    await sendEmail({
      email: bloodBank.email,
      subject: "Blood Bridge password reset verification",
      message: `Click the given link to change your password: ${url}`,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${bloodBank.email} successfully`,
    });
  } catch (err) {
    bloodBank.resetPasswordToken = undefined;
    bloodBank.resetPasswordExpire = undefined;
    await bloodBank.save({ validateBeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
});

// RESET PASSWORD -
exports.resetPassword = catchAsyncErr(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const token = req.params.token;

  if (!password || !confirmPassword) {
    return next(
      new ErrorHandler("Please enter your password and confirm password", 400)
    );
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const bloodBank = await bloodBankModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!bloodBank) {
    return next(
      new ErrorHandler("Your password reset link is invalid or expired", 400)
    );
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords don't match", 400));
  }

  bloodBank.password = req.body.password;
  bloodBank.resetPasswordToken = undefined;
  bloodBank.resetPasswordExpire = undefined;

  await bloodBank.save();
  res.status(200).json({
    success: true,
    message: "Your password has been changed",
  });
});

// GET BLOOD BANK DETAILS -
exports.getBloodBank = catchAsyncErr(async (req, res) => {
  const bloodBank = await bloodBankModel.findById(req.authUser.id);

  res.status(200).json({
    success: true,
    bloodBank,
  });
});

// UPDATE BLOOD BANK PASSWORD -
exports.updatePassword = catchAsyncErr(async (req, res, next) => {
  const { oldPassword, confirmPassword, newPassword } = req.body;

  if (!oldPassword || !confirmPassword || !newPassword) {
    return next(new ErrorHandler("Please fill in all required fields", 400));
  }

  const bloodBank = await bloodBankModel
    .findById(req.authUser.id)
    .select("+password");
  const isPasswordMatched = await bloodBank.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Your old password is incorrect", 400));
  }

  if (confirmPassword !== newPassword) {
    return next(new ErrorHandler("Passwords don't match", 400));
  }

  if (newPassword === oldPassword) {
    return next(new ErrorHandler("Please use a different password", 400));
  }

  bloodBank.password = newPassword;
  await bloodBank.save();
  setToken(bloodBank, 200, res);
});

// UPDATE BLOOD BANK PROFILE -
exports.updateProfile = catchAsyncErr(async (req, res, next) => {
  const bloodBank = await bloodBankModel.findById(req.authUser.id);

  const newData = {
    name: req.body.name,
    email: req.body.email,
    licenseNo: req.body.licenseNo,
    city: req.body.city,
    address: req.body.address,
    sector: req.body.sector,
    status: req.body.status,
    contact: req.body.contact,
    avatar: req.body.avatar,
  };

  if (req.body.email !== undefined) {
    if (
      (req.body.email === bloodBank.email &&
        bloodBank.emailVerified === true) ||
      (req.body.email === bloodBank.email && bloodBank.emailVerified === null)
    ) {
      return next(new ErrorHandler("Your email is already verified", 403));
    }

    if (bloodBank.emailVerified === false) {
      return next(new ErrorHandler("Confirm your email address", 403));
    }

    const emailExists = await bloodBankModel.findOne({ email: req.body.email });
    if (emailExists) {
      return next(
        new ErrorHandler("Please use a different email address", 400)
      );
    }

    const token = await new verificationModel({
      BloodBankId: bloodBank._id,
      token: crypto.randomBytes(32).toString("hex"),
      purpose: "emailVerify",
    });

    bloodBank.emailVerified = false;
    await Promise.all([token.save(), bloodBank.save()]);

    const url = `${process.env.BASE_URL}/bloodBank/${bloodBank.id}/verify/${token.token}`;

    await sendEmail({
      email: req.body.email,
      subject: "Blood Bridge Email Verification",
      message: `Click the given link to verify your email: ${url}`,
    });
  }

  const updated_bloodBank = await bloodBankModel.findByIdAndUpdate(
    req.authUser.id,
    newData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Your profile changes have been saved",
    updated_bloodBank,
  });
});

// COMPLETE BLOOD BANK PROFILE -
exports.completeProfile = catchAsyncErr(async (req, res, next) => {
  const { city, address, sector } = req.body;

  if (!city || !address || !sector) {
    return next(new ErrorHandler("Please fill in all required fields", 400));
  }

  const bloodBank = await bloodBankModel.findById(req.authUser.id);

  if (bloodBank.profileVerified) {
    return next(new ErrorHandler("Your profile is already completed", 409));
  }

  await bloodBank.updateOne(
    {
      $set: {
        profileVerified: true,
        status: "open",
        city,
        address,
        sector,
      },
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Your profile has been completed",
  });
});

// VERIFY UPDATED EMAIL -
exports.verifyEmail = catchAsyncErr(async (req, res, next) => {
  const bloodBank = await bloodBankModel.findOne({ _id: req.params.id });
  const token = await verificationModel.findOne({
    BloodBankId: bloodBank._id,
    token: req.params.token,
  });

  if (!bloodBank) {
    return next(new ErrorHandler("Invalid email verification link", 400));
  }

  if (!token) {
    return next(new ErrorHandler("Invalid email verification link", 400));
  }

  await bloodBank.updateOne({ _id: bloodBank._id, emailVerified: true });
  await token.deleteOne();

  res.status(200).json({
    success: true,
    message: "Thank you for verifying your email address",
  });
});

// RESEND EMAIL VERIFICATIO FOR UPDATED -
exports.resendEmailVerification = catchAsyncErr(async (req, res, next) => {
  const bloodBank = await bloodBankModel.findById(req.authUser.id);
  let token = await verificationModel.findOne({ BloodBankId: bloodBank._id });

  if (bloodBank.emailVerified || bloodBank.emailVerified === null) {
    return next(new ErrorHandler("Your account is already verified", 409));
  }

  if (token === null) {
    const newToken = await verificationModel.create({
      BloodBankId: bloodBank._id,
      token: crypto.randomBytes(32).toString("hex"),
      purpose: "emailVerify",
    });

    const url = `${process.env.BASE_URL}/bloodBank/${bloodBank.id}/verify/${newToken.token}`;

    await sendEmail({
      email: bloodBank.email,
      subject: "Blood Bridge Email Verification",
      message: `Click the given link to verify your email: ${url}`,
    });

    return res.status(200).json({
      success: true,
      message: `Email sent to ${bloodBank.email} successfully`,
    });
  }

  return next(
    new ErrorHandler(
      "Activate your account by clicking the link in the email",
      403
    )
  );
});

// GET BLOOD BANK COORDINATES -
exports.getBloodBankLocation = catchAsyncErr(async (req, res) => {
  const { longitude, latitude } = await parseLocation();

  res.status(200).json({
    success: true,
    longitude,
    latitude,
  });
});

// DEACTIVATE BLOOD BANK ACCOUNT -
exports.deactivateAccount = catchAsyncErr(async (req, res, next) => {
  const id = req.authUser.id;

  const updatedBloodBank = await bloodBankModel.findByIdAndUpdate(
    id,
    {
      isActive: false,
      status: "close",
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!updatedBloodBank) {
    return next(new ErrorHandler("Blood bank not found", 404));
  }

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Your account has been deactivated",
  });
});


///////////////////////////////////////////////// ADMIN ROUTES ///////////////////////////////////////////////////

// GET ALL BLOOD BANKS -
exports.getAllBloodBanks = catchAsyncErr(async (req, res) => {
  const bloodBanks = await bloodBankModel.find();

  res.status(200).json({
    success: true,
    bloodBanks,
  });
});
