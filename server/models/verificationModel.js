// IMPORTS -
const mongoose = require('mongoose')

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  BloodBankId: {
    type: mongoose.Schema.ObjectId,
    ref: 'bloodBank',
  },

  token: {
    type: String,
    required: true,
  },

  purpose: {
    type: String,
    required: true,
    enum: ['accountVerify', 'emailVerify'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // 1 hour
  },
})

const Verification = mongoose.model('Verification', verificationSchema)
module.exports = Verification
