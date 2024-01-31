// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodBankModel = require("../models/bloodBankModel");
const verificationModel = require("../models/verificationModel");
const bloodRequestModel = require("../models/bloodRequestModel");
const bloodDonationModel = require("../models/bloodDonationModel");
const setToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

// PARTIALS -
const imageBuffer =
  "https://utfs.io/f/d7cfaa2b-ee7b-47eb-8963-1f41ab93b88f-nest39.webp";

// REGISTER A BLOOD BANK -
exports.registerBloodBank = catchAsyncErr(async (req, res, next) => {
  const { name, email, password, licenseNo, contact, longitude, latitude } =
    req.body;

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
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
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

  if (bloodBank.block === true) {
    return next(
      new ErrorHandler(
        "We've temporarily restricted your account access. Please reach out to our support team for further assistance",
        403
      )
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
  const token = bloodBank.getJsonWebToken();

  res.status(200).json({
    success: true,
    message: "You are logged in!",
    token,
    bloodBank,
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

  res.status(200).json({
    success: true,
    message: "Password has been updated",
  });
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
    giveBlood: req.body.giveBlood,
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
  const { city, address, sector, giveBlood } = req.body;

  if (!city || !address || !sector || !giveBlood) {
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
        giveBlood,
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

// GET BLOOD BANK REVIEWS -
exports.getAllReviews = catchAsyncErr(async (req, res) => {
  const reviews = await reviewModel
    .find({ bloodBank: req.authUser.id })
    .populate("user", "firstName lastName");

  res.status(200).json({
    success: true,
    reviews,
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

// VIEW ANY BLOOD BANK -
exports.viewBloodBank = catchAsyncErr(async (req, res, next) => {
  const bloodBank = await bloodBankModel.findById(req.params.id);

  if (!bloodBank) {
    return next(new ErrorHandler("Blood bank not found", 404));
  }

  res.status(200).json({
    success: true,
    bloodBank,
  });
});

// UPDATE ACCOUNT STATUS -
exports.updateAccountStatus = catchAsyncErr(async (req, res, next) => {
  const { status } = req.body;
  const bloodBank = await bloodBankModel.findById(req.params.id);
  let flag = "pending";

  if (!status) {
    return next(new ErrorHandler("Status is missing", 404));
  }

  if (!bloodBank) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (status === "verified" && bloodBank.accountVerified === "pending") {
    bloodBank.accountVerified = "verified";
    flag = "verified";
  }

  if (status === "pending" && bloodBank.accountVerified === "verified") {
    bloodBank.accountVerified = "pending";
    flag = "pending";
  }

  await bloodBank.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `${bloodBank.name} is ${flag}`,
  });
});

// BLOCK USER -
exports.blockBloodBank = catchAsyncErr(async (req, res, next) => {
  const { status } = req.body;
  const bloodBank = await bloodBankModel.findById(req.params.id);
  let flag = "";

  if (!status) {
    return next(new ErrorHandler("Status is missing", 404));
  }

  if (!bloodBank) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (status === "blocked") {
    bloodBank.block = true;
    flag = "blocked";
  }

  if (status === "unblocked") {
    bloodBank.block = false;
    flag = "unblocked";
  }

  await bloodBank.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `${bloodBank.name} has been ${flag}`,
  });
});

// DELETE USER -
exports.deleteBloodBank = catchAsyncErr(async (req, res, next) => {
  const bloodBank = await bloodBankModel.findById(req.params.id);

  if (!bloodBank) {
    return next(new ErrorHandler("Blood bank not found", 404));
  }

  await bloodBank.deleteOne();
  res.status(200).json({
    success: true,
    message: "Blood bank deleted successfully",
  });
});

// GET ALL BLOOD REQUESTS -
exports.getBloodRequests = catchAsyncErr(async (req, res) => {
  const bloodRequests = await bloodRequestModel
    .find()
    .populate("bloodBank bloodGroup", "name bloodGroup");

  res.status(200).json({
    success: true,
    bloodRequests,
  });
});

// GET ALL BLOOD DONATIONS -
exports.getBloodDonations = catchAsyncErr(async (req, res) => {
  const bloodDonations = await bloodDonationModel
    .find()
    .populate("bloodBank bloodGroup", "name bloodGroup");

  res.status(200).json({
    success: true,
    bloodDonations,
  });
});
