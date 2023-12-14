// IMPORTS -
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

// CONFIG -
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "./config/config.env" });
}

// // FOR DEPLOYMENT -
// app.get("/", (req, res) => {
//   res.send("<h1>Processing</h1>");
// });

// MIDDLEWARES -
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(
  cors({
    credentials: true,
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 204
  })
);

// FOR TESTING - 
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

// IMPORT ROUTES -
const userRoute = require("./routes/userRoute");
const bloodBankRoute = require("./routes/bloodBankRoute");
const bloodGroupRoute = require("./routes/bloodGroupRoute");
const bloodRequestRoute = require("./routes/bloodRequestRoute");
const bloodDonationRoute = require("./routes/bloodDonationRoute");
const eventRoute = require("./routes/eventRoute");

// ROUTES -
app.use("/api", userRoute);
app.use("/api", bloodBankRoute);
app.use("/api", bloodGroupRoute);
app.use("/api", bloodRequestRoute);
app.use("/api", bloodDonationRoute);
app.use("/api", eventRoute);

// MIDDLEWARE FOR ERROR-HANDLING -
app.use(errorMiddleware);

module.exports = app;
