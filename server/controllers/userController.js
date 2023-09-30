// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const userModel = require("../models/userModel");
const setToken = require("../utils/jwtToken");

// Register user -
exports.registerUser = catchAsyncErr(async (req, res, next) => {

    console.log(req.body);

})