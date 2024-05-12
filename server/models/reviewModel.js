// IMPORTS -
const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Please enter your review'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    bloodBank: {
      type: mongoose.Schema.ObjectId,
      ref: 'bloodBank',
      required: true,
    },

    reqType: {
      type: String,
      enum: ['donate', 'request'],
      required: true,
    },

    typeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'bloodDonation' || 'bloodRequest',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const reviewModel = mongoose.model('review', reviewSchema)
module.exports = reviewModel
