// IMPORTS -
const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.DATABASE_URL).then((data) => {
    console.log(`DATABASE CONNECTED WITH THE SERVER: ${data.connection.host}`);
  });
};

module.exports = connectDB;
