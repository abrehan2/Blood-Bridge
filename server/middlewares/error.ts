// IMPORTS -
const ErrorHandler = require("../utils/errorHandle");
import { errorMiddlewareProp } from "../types/type";

const errorMiddleware = ({ err, req, res, next }: errorMiddlewareProp) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // WRONG MONGODB ID ERROR -
  if (err.name === "CastError") {
    const message = `Resource not found`;
    err = new ErrorHandler(message, 400);
  }

  // MONGOOSE DUPLICATE KEY ERROR -
  if (err.code === 11000) {
    const message = `Duplicate key entered`;
    err = new ErrorHandler(message, 400);
  }

  // WRONG JSON WEB TOKEN ERROR -
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, please try again!`;
    err = new ErrorHandler(message, 400);
  }

  // JSON WEB TOKEN EXPIRY ERROR -
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired, please try again!`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorMiddleware;
