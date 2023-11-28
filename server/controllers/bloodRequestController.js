// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodRequestModel = require("../models/bloodRequestModel");
const bloodBankModel = require("../models/bloodBankModel");
const bloodGroupModel = require("../models/BloodGroupModel");
const userModel = require("../models/userModel");
const moment = require("moment");
const sendEmail = require("../utils/email");

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

  // CHECK IF THE 24 HOURS ARE COMPLETED TO MAKE ANOTHER BLOOD REQUEST OR IF THE PREVIOUS REQUEST GETS ACCEPTED -

  const lastRequest = await bloodRequestModel.findOne({
    user: req.authUser.id,
    $and: [
      { createdAt: { $gte: moment().subtract(24, "hours").toDate() } }, // 11:49 PM
      { reqStatus: "Pending" },
    ],
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
    .populate({ path: "user", select: "cnic" })
    .populate("bloodGroup", "bloodGroup");

  res.status(200).json({
    success: true,
    bloodRequests,
  });
});

// GET ALL BLOOD REQUESTS FOR USER -
exports.getUserBloodRequests = catchAsyncErr(async (req, res) => {
  const bloodRequests = await bloodRequestModel
    .find({ user: req.authUser.id })
    .populate("bloodGroup bloodBank", "bloodGroup name city");

  res.status(200).json({
    success: true,
    bloodRequests,
  });
});

// UPDATE BLOOD REQUEST STATUS -
exports.updateStatus = catchAsyncErr(async (req, res, next) => {
  const { status, message } = req.body;

  const bloodRequest = await bloodRequestModel
    .findById(req.params.id)
    .populate("bloodGroup", "bloodGroup")
    .populate({ path: "user", select: "email" })
    .populate({ path: "bloodBank", select: "address contact" });

  const bloodType = await bloodGroupModel.findOne({
    $and: [
      { bloodBank: req.authUser.id },
      { bloodGroup: bloodRequest?.bloodGroup?.bloodGroup },
    ],
  });

  if (!bloodRequest) {
    return next(new ErrorHandler("Blood request not found", 404));
  }

  if (!bloodType) {
    return next(new ErrorHandler("Blood type not found", 400));
  }

  if (bloodRequest.reqStatus === "Completed" && status == "Completed") {
    return next(new ErrorHandler("Blood request is already completed", 400));
  }

  if (bloodRequest.reqStatus === "Accepted" && status == "Accepted") {
    return next(new ErrorHandler("Blood request is already accepted", 400));
  }

  if (bloodRequest?.bloodBags > bloodType.stock) {
    return next(
      new ErrorHandler(
        `Insufficient ${bloodType.bloodGroup} blood stock to fulfill this request`,
        406
      )
    );
  } else {
    if (status === "Accepted" && bloodRequest.reqStatus === "Pending") {
      await emailUser(bloodRequest, message, res);
    }

    if (status === "Completed" && bloodRequest.reqStatus === "Accepted") {
      await updateStock(bloodRequest, bloodType, res);
    }
  }

  if (status === "Rejected" && bloodRequest.reqStatus === "Pending") {
    await removeRequest(bloodRequest, res);
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
const emailUser = async (bloodRequest, message, res) => {
  console.log(message);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blood Bridge: Blood Request Update</title>
</head>
<body>
  <p>Dear ${bloodRequest?.name},</p>

  <p>We'd like to inform you that your request for blood has been accepted!</p>
  <p>Please visit us on <b>${message?.day}</b> at <b>${message?.time}</b>.</p>
  <p><b>Location:</b> ${bloodRequest?.bloodBank.address}</p>

  <p>Best,</p>
  <p><b>Blood Bridge Team</b></p>
</body>
</html>`;

  await sendEmail({
    email: bloodRequest?.user?.email,
    subject: "Blood Bridge: Blood Request Update",
    message: html,
  });

  bloodRequest.reqStatus = "Accepted";
  await bloodRequest.save({ validateBeforeSave: true });

  sendSuccessResponse(res, "Blood request has been updated");
};

// UPDATE STOCK -
const updateStock = async (bloodRequest, bloodType, res) => {
  bloodType.stock -= bloodRequest?.bloodBags;
  bloodRequest.reqStatus = "Completed";

  await Promise.all([
    bloodType.save({ validateBeforeSave: true }),
    bloodRequest.save({ validateBeforeSave: true }),
  ]);

  sendSuccessResponse(res, "Blood request has been updated");
};

// REMOVE BLOOD REQUEST -
const removeRequest = async (bloodRequest, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blood Bridge: Blood Request Update</title>
</head>
<body>
  <p>Dear ${bloodRequest?.name},</p>

  <p>We apologize to inform you that we are unable to fulfill your blood request at this time.</p>
  <p>For further information, please reach out to us at <b>${bloodRequest?.bloodBank.contact}</b>.<p/>  

  <p>Best,</p>
  <p><b>Blood Bridge Team</b></p>
</body>
</html>`;

  await sendEmail({
    email: bloodRequest?.user?.email,
    subject: "Blood Bridge: Blood Request Update",
    message: html,
  });
  await bloodRequest.deleteOne();

  sendSuccessResponse(res, "Blood request has been updated");
};
