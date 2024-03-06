// IMPORTS -
const mongoose = require('mongoose')
const moment = require('moment')

const bloodDonationSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: [true, 'Please select the blood type'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },

  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },

  contact: {
    type: String,
    required: [true, 'Please enter your contact'],
  },

  age: {
    type: String,
    required: [true, 'Please enter your age'],
  },

  bloodBank: {
    type: mongoose.Schema.ObjectId,
    ref: 'bloodBank',
    required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  disease: {
    type: String,
    required: [true, 'Please enter your disease, if any, prior to blood donation'],
  },

  donationDate: {
    type: Date,
    required: [true, 'Please select the date you would like to schedule your blood donation'],
  },

  donationStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Rejected'],
    default: 'Pending',
  },

  donationType: {
    type: String,
    enum: ['System', 'Site'],
  },

  createdAt: {
    type: Date,
    default: () => moment().utc().startOf('day').toDate(),
  },
})

bloodDonationSchema.index({ contact: 1 })

const bloodDonationModel = mongoose.model('bloodDonation', bloodDonationSchema)

module.exports = bloodDonationModel
