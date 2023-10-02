// IMPORTS -
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");

// CONFIG -
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "./config/config.env" });
}

// MIDDLEWARES -
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(
  cors({
    credentials: true,
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// IMPORT ROUTES -
const userRoute = require("./routes/userRoute");
const bloodBank = require("./routes/bloodBankRoute");

// ROUTES -
app.use("/api", userRoute);
app.use("/api", bloodBank);

// MIDDLEWARE FOR ERROR-HANDLING -
app.use(errorMiddleware);

module.exports = app;
