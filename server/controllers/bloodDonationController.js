// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodDonationModel = require("../models/bloodDonationModel");
const bloodBankModel = require("../models/bloodBankModel");
const bloodGroupModel = require("../models/BloodGroupModel");
const userModel = require("../models/userModel");
const moment = require("moment");
const sendEmail = require("../utils/email");

// CREATE A BLOOD DONATION REQUEST -
exports.createBloodDonation = catchAsyncErr(async (req, res, next) => {
  const { name, contact, age, bloodBank, bloodGroup, donationDate, disease } =
    req.body;

  if (
    !name ||
    !contact ||
    !age ||
    !bloodBank ||
    !bloodGroup ||
    !donationDate ||
    !disease
  ) {
    return next(new ErrorHandler("Please fill in all required fields", 400));
  }

  const userExist = await userModel.findById(req.authUser.id);
  const testName = `${userExist?.firstName} ${userExist?.lastName}`;

  if (testName !== name || contact !== userExist?.contact) {
    return next(
      new ErrorHandler(
        "Please use the same name and contact information as the ones in your profile",
        400
      )
    );
  }

  // CHECK IF THE BLOOD BANK EXISTS -
  const bloodBankExist = await bloodBankModel.findOne({ name: bloodBank });

  if (!bloodBankExist) {
    return next(new ErrorHandler("Blood bank not found", 404));
  }

  const startOfThreeMonthsAgo = moment()
    .utc()
    .subtract(3, "months")
    .startOf("month")
    .toDate();
  const startOfTwoMonthsAgo = moment()
    .utc()
    .subtract(2, "months")
    .startOf("month")
    .toDate();
  const lastRequest = await bloodDonationModel.find({
    user: req.authUser.id,
    $or: [
      {
        createdAt: {
          $gt: startOfThreeMonthsAgo,
          $lt: startOfTwoMonthsAgo,
        },
      },
      { donationStatus: { $in: ["Pending", "Accepted"] } },
    ],
  });

  const threeMonthsLater = moment().utc().add(3, "months").toDate();

  const lastLatestEL = lastRequest[lastRequest.length - 1];
  console.log(lastLatestEL);
  if (lastLatestEL && lastLatestEL?.donationStatus !== "Rejected") {
    return next(
      new ErrorHandler(
        `We appreciate your willingness to donate blood regularly. To maintain donor eligibility and ensure a healthy blood donation experience, we recommend waiting until ${threeMonthsLater} to schedule your next blood donation`,
        429
      )
    );
  }

  await bloodDonationModel.create({
    name,
    contact,
    age,
    bloodBank: bloodBankExist._id,
    bloodGroup,
    user: userExist._id,
    disease,
    donationDate,
    donationType: "System",
  });

  res.status(201).json({
    success: true,
    message:
      "Your blood donation request has been processed and we will contact you soon regarding the next steps",
  });
});

// MANUAL BLOOD DONATION -
exports.manualDonation = catchAsyncErr(async (req, res, next) => {
  const { name, contact, age, bloodGroup, donationDate, disease } = req.body;

  if (!name || !contact || !age || !bloodGroup || !donationDate || !disease) {
    return next(new ErrorHandler("Please fill in all required fields", 400));
  }

  await bloodDonationModel.create({
    name,
    contact,
    age,
    bloodBank: req.authUser.id,
    bloodGroup,
    disease,
    donationDate,
    donationType: "Site",
    donationStatus: "Completed",
  });

  res.status(201).json({
    success: true,
    message: "Blood dontion request has been processed",
  });
});

// GET ALL DONATION REQUESTS FOR BLOOD BANK-
exports.getBloodDonations = catchAsyncErr(async (req, res) => {
  const bloodDonations = await bloodDonationModel.find({
    bloodBank: req.authUser.id,
  }).populate({path: "user"});

  res.status(200).json({
    success: true,
    bloodDonations,
  });
});

// GET ALL DONATION REQUESTS FOR USER -
exports.getUserBloodDonations = catchAsyncErr(async (req, res) => {
  const bloodDonations = await bloodDonationModel
    .find({ user: req.authUser.id })
    .populate({
      path: "user",
      select: "cnic",
    })
    .populate("bloodGroup bloodBank", "bloodGroup name city");

  res.status(200).json({
    success: true,
    bloodDonations,
  });
});

// UPDATE BLOOD DONATION STATUS -
exports.updateDonationStatus = catchAsyncErr(async (req, res, next) => {
  const { status, message } = req.body;

  const bloodDonation = await bloodDonationModel
    .findById(req.params.id)
    .populate("bloodGroup", "bloodGroup")
    .populate({ path: "user", select: "email cnic" })
    .populate({ path: "bloodBank", select: "address contact city sector" });

  if (!bloodDonation) {
    return next(new ErrorHandler("Blood donation not found", 404));
  }

  // NECESSARY CONDITIONS -
  if (bloodDonation.donationStatus === "Completed" && status === "Completed") {
    return next(new ErrorHandler("Blood donation is already completed", 400));
  }

  if (bloodDonation.donationStatus === "Accepted" && status === "Accepted") {
    return next(new ErrorHandler("Blood donation is already accepted", 400));
  }

  if (bloodDonation.donationStatus === "Rejected" && status === "Rejected") {
    return next(new ErrorHandler("Blood donation is already rejected", 400));
  }

  if (
    (bloodDonation.donationStatus === "Accepted" ||
      bloodDonation.donationStatus === "Completed") &&
    status === "Rejected"
  ) {
    return next(
      new ErrorHandler(
        `You cannot reject the request while it is ${bloodDonation.donationStatus}`,
        400
      )
    );
  }

  // BLOOD DONATION RENDERING -
  if (status === "Accepted" && bloodDonation.donationStatus === "Pending") {
    await emailUser(bloodDonation, message, res, next);
  } else if (
    status === "Completed" &&
    bloodDonation.donationStatus === "Accepted"
  ) {
    await completeDonation(bloodDonation, res);
  } else if (status === "Rejected") {
    await rejectDonation(bloodDonation, res);
  }
});

// COMMON SUCCESS FUNCTIONS TO AVOID HEADERS ERROR -
const sendSuccessResponse = (res, message) => {
  res.status(200).json({
    success: true,
    message,
  });
};

// EMAIL USER -
const emailUser = async (bloodDonation, message, res) => {
  const location = `${bloodDonation?.bloodBank.sector}, ${bloodDonation?.bloodBank.address}, ${bloodDonation?.bloodBank.city}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blood Bridge: Blood Donation Update</title>
</head>
<body>
  <p>Dear ${bloodDonation?.name},</p>

  <p>We'd like to inform you that your request for blood donation has been accepted!</p>
  <p>Please visit us on <b>${message?.day}</b> at <b>${message?.time}</b>.</p>
  <p><b>Location:</b> ${location}.</p>

  <p>Best,</p>
  <p><b>Blood Bridge Team</b></p>
</body>
</html>`;

  await sendEmail({
    email: bloodDonation?.user?.email,
    subject: "Blood Bridge: Blood Donation Update",
    message: html,
  });

  bloodDonation.donationStatus = "Accepted";
  await bloodDonation.save({ validateBeforeSave: true });

  sendSuccessResponse(res, "Blood donation has been updated");
};

// COMPLETE DONATION -
const completeDonation = async (bloodDonation, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blood Bridge: Blood Donation Update</title>
</head>
<body>
  <p>Dear ${bloodDonation?.name},</p>

  <p>We'd like to inform you that your request for blood donation has been completed!</p>

  <p>Best,</p>
  <p><b>Blood Bridge Team</b></p>
</body>
</html>`;

  await sendEmail({
    email: bloodDonation?.user?.email,
    subject: "Blood Bridge: Blood Donation Update",
    message: html,
  });

  bloodDonation.donationStatus = "Completed";
  await bloodDonation.save({ validateBeforeSave: true });
  sendSuccessResponse(res, "Blood donation has been updated");
};

// REJECT BLOOD DONATION -
const rejectDonation = async (bloodDonation, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blood Bridge: Blood Donation Update</title>
</head>
<body>
  <p>Dear ${bloodDonation?.name},</p>

  <p>We apologize to inform you that we are unable to fulfill your blood donation at this time.</p>
  <p>For further information, please reach out to us at <b>${bloodDonation?.bloodBank.contact}</b>.<p/>  

  <p>Best,</p>
  <p><b>Blood Bridge Team</b></p>
</body>
</html>`;

  await sendEmail({
    email: bloodDonation?.user?.email,
    subject: "Blood Bridge: Blood Donation Update",
    message: html,
  });

  bloodDonation.donationStatus = "Rejected";
  await bloodDonation.save({ validateBeforeSave: true });
  sendSuccessResponse(res, "Blood donation has been updated");
};
