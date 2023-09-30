// IMPORTS -
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error");


// CONFIG -
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "./config/config.env" });
}

// MIDDLEWARES -
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// ROUTES TO IMPLEMENT -

app.use(errorMiddleware);

module.exports = app;
