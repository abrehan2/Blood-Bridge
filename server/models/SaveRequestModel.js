// IMPORTS  -
const mongoose = require('mongoose')

const requestRecordSchema = new mongoose.Schema({
  Requester: {
    type: mongoose.Schema.ObjectId,
    ref: 'bloodBank',
    required: true,
  },

  bloodBanks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'bloodBank',
    },
  ],

  bloodType: {
    type: String,
    required: true,
  },

  bloodBags: {
    type: Number,
    required: true,
  },

  urgent: {
    type: Boolean,
    default: false,
  },

  area: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const requestRecordModel = mongoose.model('RequestRecord', requestRecordSchema)
module.exports = requestRecordModel
