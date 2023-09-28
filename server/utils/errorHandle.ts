// IMPORTS -
import { errorProps } from "../types/type";

class ErrorHandler extends Error {
  statusCode;
  constructor({ message, statusCode }: errorProps) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
