// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodRequestModel = require("../models/bloodRequestModel");
const bloodBankModel = require("../models/bloodBankModel");
const bloodGroupModel = require("../models/BloodGroupModel");

// CREATE BLOOD REQUEST -
exports.createBloodRequest = catchAsyncErr(async (req, res, next) => {

    const {name, contact, bloodBank, bloodGroup, bloodBags, bloodNeededOn} = req.body;

    if (!name || !contact || !bloodBank || !bloodGroup || !bloodBags || !bloodNeededOn) {
        return next(new ErrorHandler("Please fill in all required fields", 400));
    }

    const bloodBankExist = await bloodBankModel.findOne({name: bloodBank});



});


