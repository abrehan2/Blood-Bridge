// IMPORTS -
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("./catchAsyncErr");

// AUTHENTICATE USER -
exports.authenticate = catchAsyncErr(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decode.id);
  next();
});

// AUTHORIZE ROLES -
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role '${req.user.role}' is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
