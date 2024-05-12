// IMPORTS -
const mongoose = require('mongoose')

const bloodRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },

  contact: {
    type: String,
    required: [true, 'Please enter your contact'],
  },

  bloodBank: {
    type: mongoose.Schema.ObjectId,
    ref: 'bloodBank',
    required: true,
  },

  bloodGroup: {
    type: mongoose.Schema.ObjectId,
    ref: 'bloodGroup',
    required: true,
  },

  receivedBlood: [
    {
      type: String,
      default: null,
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  bloodBags: {
    type: Number,
    default: 1,
    required: [true, 'Please enter the number of blood bags'],
  },

  bloodNeededOn: {
    type: Date,
    required: [true, 'Please select the date you will need the blood bags'],
  },

  reqStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Rejected'],
    default: 'Pending',
  },

  requestType: {
    type: String,
    enum: ['System', 'Site'],
  },

  reviewed: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// TACKLE THE DUPLICATION ERROR FOR THE CONTACT -
bloodRequestSchema.index({ contact: 1 })

const bloodRequestModel = mongoose.model('bloodRequest', bloodRequestSchema)
module.exports = bloodRequestModel
