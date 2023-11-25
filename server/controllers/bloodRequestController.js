// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodRequestModel = require("../models/bloodRequestModel");
const bloodBankModel = require("../models/bloodBankModel");
const bloodGroupModel = require("../models/BloodGroupModel");
const userModel = require("../models/userModel");
const moment = require("moment");

// CREATE BLOOD REQUEST -
exports.createBloodRequest = catchAsyncErr(async (req, res, next) => {
  const { name, contact, bloodBank, bloodGroup, bloodBags, bloodNeededOn } =
    req.body;

  if (
    !name ||
    !contact ||
    !bloodBank ||
    !bloodGroup ||
    !bloodBags ||
    !bloodNeededOn
  ) {
    return next(new ErrorHandler("Please fill in all required fields", 400));
  }

  // CHECK IF THE REQUESTED BLOOD BAGS ARE GREATER THAN ZERO -
  if (bloodBags < 1) {
    return next(
      new ErrorHandler("The number of blood bags must be greater than 0", 400)
    );
  }

  // NOT IMPLEMENTING USER VALIDATION AS THIS CONTROLLER WILL ONLY EXECUTE WHEN THE USER IS AUTHORIZED -
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

  // CHECK IF THE REQUESTED BLOOD BAGS ARE IN RANGE OF THE BLOOD BANK'S CURRENT INVENTORY -
  if (bloodBags > bloodGroupExist?.stock) {
    return next(
      new ErrorHandler(
        `The ${bloodBankExist?.name} does not currently have enough blood bags of type ${bloodGroup} to fulfill your request`,
        422
      )
    );
  }

  // CHECK IF THE 24 HOURS ARE COMPLETED TO MAKE ANOTHER BLOOD REQUEST -
  const lastRequest = await bloodRequestModel.findOne({
    user: req.authUser.id,
    createdAt: { $gte: moment().subtract(24, "hours").toDate() },
  });

  if (lastRequest) {
    return next(
      new ErrorHandler(
        "You have already submitted a blood request. Please wait 24 hours before submitting another request.",
        429
      )
    );
  }

  await bloodRequestModel.create({
    name,
    contact,
    bloodBank: bloodBankExist._id,
    bloodGroup: bloodGroupExist._id,
    user: userExist._id,
    bloodBags,
    bloodNeededOn,
  });

  res.status(201).json({
    success: true,
    message:
      "Your blood request has been processed and we will contact you soon regarding the next steps.",
  });
});

// GET ALL BLOOD REQUESTS FOR BLOOD BANK -
exports.getBloodRequests = catchAsyncErr(async (req, res) => {
  const bloodRequests = await bloodRequestModel
    .find({ bloodBank: req.authUser.id })
    .populate("bloodGroup", "bloodGroup");

  res.status(200).json({
    success: true,
    bloodRequests,
  });
});

// GET ALL USER BLOOD REQUESTS -