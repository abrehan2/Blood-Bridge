// IMPORTS -
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const bloodBankModel = require("../models/bloodBankModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("./catchAsyncErr");

exports.authenticate = (model) =>
  catchAsyncErr(async (req, res, next) => {
    const { token } = req.cookies;
  
    if (!token) {
      return next(new ErrorHandler("Please login to continue", 401));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.authUser = await model.findById(decode.id);
   

    next();
  });

// AUTHORIZE BASED ON ROLES -
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.authUser) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    if (!roles.includes(req.authUser?.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.authUser.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};

// Middleware for authenticating users
exports.authenticateUser = exports.authenticate(userModel);

// Middleware for authenticating blood banks
exports.authenticateBloodBank = exports.authenticate(bloodBankModel);
