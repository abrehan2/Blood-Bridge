// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodGroupModel = require("../models/BloodGroupModel");

// CREATE BLOOD TYPE -
exports.createBloodType = catchAsyncErr(async (req, res, next) => {
  req.body.bloodBank = req.authUser.id;

  const bloodType = await bloodGroupModel.create(req.body);

  res.status(201).json({
    success: true,
    bloodType,
  });
});
