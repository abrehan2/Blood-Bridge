// IMPORTS -
const dotenv = require("dotenv");
const application = require("./app");
const connectDatabase = require("./config/database");

// HANDLING UNCAUGHT EXCEPTION -
process.on("uncaughtException", (err: any) => {
  console.log(`ERROR: ${err.message}`);
  console.log("SHUTTING DOWN SERVER DUE TO UNCAUGHT EXCEPTION");
  process.exit(1);
});

// CONFIG -
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config/config.env" });
}

// CONNECTING DATABASE -
connectDatabase();

// CLOUDINARY TO IMPLEMENT -

// SETTING UP THE SERVER -
const server = application.listen(process.env.PORT, () => {
  console.log(`SERVER IS WORKING ON PORT: ${process.env.PORT}`);
});

// UNHANDLED PROMISE REJECTION -
process.on("unhandledRejection", (err: any) => {
  console.log(`ERROR: ${err.message}`);
  console.log("SHUTTING DOWN SERVER DUE TO UNHANDLED PROMISE REJECTION");
  server.close(() => process.exit(1));
});
