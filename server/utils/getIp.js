// IMPORTS -
const axios = require("axios").default;
const ErrorHandler = require("../utils/errorHandler");
const { default: IPData } = require("ipdata");
const ipData = new IPData(process.env.IP_DATA_API);

const parseLocation = async () => {
  try {
    // FETCH USER'S IP ADDRESS
    const {
      data: { ip },
    } = await axios.get("https://api.ipify.org?format=json");

    // PARSE IP ADDRESS
    const ipInfo = await ipData.lookup(ip);

    const parser = {
      longitude: ipInfo?.longitude,
      latitude: ipInfo?.latitude,
    };

    return parser;
  } catch (error) {
    throw new ErrorHandler(error.message, 400);
  }
};

module.exports = parseLocation;
