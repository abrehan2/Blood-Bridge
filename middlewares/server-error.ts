// IMPORTS -
import ErrorHandler from "@/app/utils/errorHandle";
import { NextRequest, NextResponse, NextMiddleware } from "next/server";

// PARTIALS -
interface ErrProps {
  err?: any;
  req?: NextRequest;
  res?: NextResponse;
  next?: NextMiddleware;
}

const catchErr = ({ err, req, res, next }: ErrProps) => {
  err.status = err.status || 500;
  err.message = err.message || "Internal server error";

  // WRONG MONGO ID ERROR -
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // MONGOOSE DUPLICATE KEY ERROR -
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered!`;
    err = new ErrorHandler(message, 400);
  }

  // WRONG JWT TOKEN -
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, please try again!`;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE ERROR -
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired, please try again!`;
    err = new ErrorHandler(message, 400);
  }

  res?.status.toLocaleString(
    err.status.json({
      success: false,
      message: err.message,
    })
  );
};

export default catchErr;
