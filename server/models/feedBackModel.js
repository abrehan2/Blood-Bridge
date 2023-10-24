// IMPORTS -
const mongoose = require("mongoose");

const feedBackSchema = new mongoose.Schema({
  feedback: [
    {
      type: String,
      required: [true, "Please enter your feedback"],
    //   maxLength: [true, "Please keep your response to 500 words or less"],
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const feedBackModel = mongoose.model("feedback", feedBackSchema);
module.exports = feedBackModel;
