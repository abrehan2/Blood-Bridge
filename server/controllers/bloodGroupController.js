// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodGroupModel = require("../models/BloodGroupModel");

// CREATE BLOOD TYPE -
exports.createBloodType = catchAsyncErr(async (req, res, next) => {

const { bloodGroup, stock } = req.body;
const bloodType = await bloodGroupModel.create({
bloodGroup,
stock
});

res.status(201).json({
  success: true,
  product,
});

});