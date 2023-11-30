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

  // CHECK IF THE BLOOD GROUP EXISTS -
  const bloodGroupExist = await bloodGroupModel.findOne({
    $and: [{ bloodGroup }, { bloodBank: bloodBankExist._id }],
  });

  if (!bloodGroupExist) {
    return next(new ErrorHandler("Blood type not found", 404));
  }

  const lastRequest = await bloodDonationModel.findOne({
    user: req.authUser.id,
    $or: [
      { createdAt: { $gte: moment().subtract(3, "months").toDate() } },
      { reqStatus: { $in: ["Pending", "Accepted"] } },
    ],
  });

  const threeMonthsLater = moment().add(3, "months").toDate();

  if (lastRequest) {
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
    bloodGroup: bloodGroupExist._id,
    user: userExist._id,
    disease,
    donationDate,
  });

  res.status(201).json({
    success: true,
    message:
      "Your blood donation request has been processed and we will contact you soon regarding the next steps.",
  });
});
