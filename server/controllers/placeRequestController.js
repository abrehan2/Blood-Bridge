// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const userModel = require("../models/userModel");
const bloodBankModel = require("../models/bloodBankModel");

// GET NEAR BY USER(S) AND BLOOD BANK(S) -
exports.getNearBy = catchAsyncErr(async (req, res, next) => {
  
  const bloodBank = await bloodBankModel.findById(req.authUser.id);
  const longitude = bloodBank.location.coordinates[0];
  const latitude = bloodBank.location.coordinates[1];

  console.log(longitude, latitude);

  const nearbyUsers = await userModel.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: 4000, // meters
        $minDistance: 0,
      },
    },

    role: { $ne: "admin" },
  });

  console.log("Nearby Users:", nearbyUsers);
});
