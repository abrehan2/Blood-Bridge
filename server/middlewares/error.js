// IMPORTS -
const ErrorHandler = require('../utils/errorHandler')

const errorMiddleware = (error, _req, res, next) => {
  console.log(error)
  error.statusCode = error.statusCode || 500
  error.message = error.message || 'Internal server error'

  // WRONG MONGODB ID ERROR -
  if (error.name === 'CastError') {
    const message = `Resource not found`
    error = new ErrorHandler(message, 400)
  }

  // MONGOOSE DUPLICATE KEY ERROR -
  if (error.code === 11000) {
    const message = `Duplicate key entered`
    error = new ErrorHandler(message, 400)
    // console.log(error.message)
  }

  // WRONG JSON WEB TOKEN ERROR -
  if (error.name === 'JsonWebTokenError') {
    const message = `Json web token is invalid, please try again!`
    error = new ErrorHandler(message, 400)
  }

  // JSON WEB TOKEN EXPIRY ERROR -
  if (error.name === 'TokenExpiredError') {
    const message = `Json web token is expired, please try again!`
    error = new ErrorHandler(message, 400)
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  })
}

module.exports = errorMiddleware
