// IMPORTS -
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");
const morgan = require("morgan");

// CONFIG -
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "./config/config.env" });
}

// FOR DEPLOYMENT -
// app.get("/", (req, res) => {
//   res.send("<h1>Processing</h1>");
// });

// MIDDLEWARES -
app.use(express.json());
app.use(morgan("dev"));
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
const bloodGroup = require("./routes/bloodGroupRoute");
const bloodRequest = require("./routes/bloodRequestRoute");

// ROUTES -
app.use("/api", userRoute);
app.use("/api", bloodBank);
app.use("/api", bloodGroup);
app.use("/api", bloodRequest);

// MIDDLEWARE FOR ERROR-HANDLING -
app.use(errorMiddleware);

module.exports = app;
