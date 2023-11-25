// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodGroupModel = require("../models/BloodGroupModel");
const NodeCache = require("node-cache");

// PARTIALS -
const cache = new NodeCache();

// CREATE BLOOD TYPE -
exports.createBloodType = catchAsyncErr(async (req, res, next) => {
  const { bloodGroup, stock } = req.body;

  if (!bloodGroup || !stock) {
    return next(new ErrorHandler("Please fill in all required fields", 400));
  }

  const bloodBank = req.authUser.id;
  const bloodGroupExist = await bloodGroupModel.findOne({
    bloodGroup,
    bloodBank,
  });

  if (bloodGroupExist) {
    return next(new ErrorHandler(`Blood type already exists`, 409));
  }

  await bloodGroupModel.create({
    bloodGroup,
    stock,
    bloodBank,
  });

  res.status(201).json({
    success: true,
    message: "Blood type has been created",
  });
});

// GET ALL BLOOD TYPES -
exports.getAllBloodTypes = catchAsyncErr(async (req, res) => {
  let bloodTypes;

  if (cache.has("bloodTypes")) {
    bloodTypes = JSON.parse(cache.get("bloodTypes"));
  } else {
    bloodTypes = await bloodGroupModel.find({
      bloodBank: req.authUser.id,
    });
    cache.set("bloodTypes", JSON.stringify(bloodTypes));
  }

  res.status(201).json({
    success: true,
    bloodTypes,
  });
});

// UPDATE BLOOD TYPE -
exports.updateBloodType = catchAsyncErr(async (req, res, next) => {
  const { bloodGroup, stock } = req.body;

  if (!bloodGroup || !stock) {
    return next(new ErrorHandler("Please fill in all required fields", 400));
  }

  const getBloodType = await bloodGroupModel.findOne({
    bloodGroup,
    bloodBank: req.authUser.id,
  });

  if (!getBloodType) {
    return next(new ErrorHandler(`Blood type does not exist`, 400));
  }

  getBloodType.stock = stock;
  await getBloodType.save();

  res.status(200).json({
    success: true,
    message: "Blood type has been updated",
  });
});

// REMOVE BLOOD TYPE -
exports.removeBloodType = catchAsyncErr(async (req, res, next) => {
  const { bloodGroup } = req.body;

  if (!bloodGroup) {
    return next(
      new ErrorHandler(
        "Please indicate which blood type you would like to remove",
        400
      )
    );
  }

  const getBloodType = await bloodGroupModel.findOne({
    bloodGroup,
    bloodBank: req.authUser.id,
  });

  if (!getBloodType) {
    return next(new ErrorHandler(`Blood type does not exist`, 400));
  }

  await getBloodType.deleteOne();

  res.status(200).json({
    success: true,
    message: "Blood type has been removed",
  });
});
