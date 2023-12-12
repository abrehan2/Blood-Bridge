// IMPORTS -
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, "Please enter the name of your event"],
    maxLength: [30, "Please keep your event name to 30 characters or less"],
  },

  description: {
    type: String,
    required: [true, "Please enter the description of your event"],
    maxLength: [
      500,
      "Please keep your event description to 500 characters or less",
    ],
  },

  guests: [
    {
      type: String,
      default: null,
    },
  ],

  venue: {
    type: String,
    required: [true, "Please enter the venue of your event"],
  },

  eventTime: {
    type: String,
    required: [true, "Please enter the time of your event"],
  },

  eventDate: {
    type: Date,
    required: [
      true,
      "Please select the date you would like to schedule your event",
    ],
  },

  image: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
