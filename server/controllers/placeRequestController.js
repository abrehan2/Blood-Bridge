// IMPORTS -
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErr = require('../middlewares/catchAsyncErr')
const userModel = require('../models/userModel')
const bloodBankModel = require('../models/bloodBankModel')
const bloodGroupModel = require('../models/BloodGroupModel')
const sendEmail = require('../utils/email')

// GET NEARBY BLOOD BANKS FOR BLOOD BANK -
exports.getNearBloodBanks = catchAsyncErr(async (req, res) => {
  const bloodBank = await bloodBankModel.findById(req.authUser.id)

  const longitude = bloodBank.location.coordinates[0]
  const latitude = bloodBank.location.coordinates[1]

  const nearbyBloodBanks = await bloodBankModel.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: 4000, // meters
        $minDistance: 0,
      },
    },

    _id: { $ne: req.authUser.id },
    status: 'open',
  })

  res.status(200).json({
    success: true,
    nearbyBloodBanks,
  })
})

// GET NEAR BY USER(S) AND BLOOD BANK(S) -
exports.getNearBy = catchAsyncErr(async (req, res, next) => {
  const bloodBank = await bloodBankModel.findById(req.authUser.id)
  const longitude = bloodBank.location.coordinates[0]
  const latitude = bloodBank.location.coordinates[1]

  const nearbyUsers = await userModel.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: 4000, // meters
        $minDistance: 0,
      },
    },

    role: { $ne: 'admin' },
  })

  const nearbyBloodBanks = await bloodBankModel.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: 4000, // meters
        $minDistance: 0,
      },
    },

    _id: { $ne: req.authUser.id },
    status: 'open',
  })

  const flag = await checkBloodType(req, next, nearbyUsers, nearbyBloodBanks)

  if (flag === false) {
    return next(
      new ErrorHandler(
        `The request for ${req.body.bloodType} blood type cannot be placed at this time`,
        404,
      ),
    )
  }

  res.status(200).json({
    success: true,
    message: `The request for ${req.body.bloodType} blood type has been placed.`,
  })
})

// CHECK BLOOD TYPE FOR BLOOD BANK -
const checkBloodType = async (req, next, users, bloodBanks) => {
  const bloodType = await bloodGroupModel.findOne({
    bloodBank: req.authUser.id,
    bloodGroup: req.body.bloodType,
  })
  let flag = null
  const bloodBank = req.authUser

  if (!bloodType) {
    return next(new ErrorHandler('Blood type not found', 404))
  }

  if (bloodType.stock < 5) {
    await doAction(bloodType, users, bloodBanks, bloodBank)
  } else {
    flag = false
  }

  return flag
}

// EMAIL USERS AND BLOOD BANKS -
const doAction = async (bloodType, users, bloodBanks, bloodBank) => {
  if (users?.length > 0) {
    await emailUsers(users, bloodType, bloodBank)
  }

  if (bloodBanks?.length > 0) {
    await emailBloodBanks(bloodBanks, bloodType, bloodBank)
  }
}

// EMAIL USERS -
const emailUsers = async (users, bloodType, bloodBank) => {
  const location = `${bloodBank?.sector}, ${bloodBank?.address}, ${bloodBank?.city}`

  for (const user of users) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Blood Bridge: Blood Donation Update</title>
        </head>
        <body>
          <p>Dear ${user?.firstName} ${user?.lastName},</p>

          <p>We'd like to inform you that <b>${bloodBank?.name}</b> needs <b>${bloodType?.bloodGroup}</b> blood type.</p>
          <p>If you are willing to donate, please contact at <b>${bloodBank?.contact}</b>.</p>
          <p><b>Location:</b> ${location}.</p>

          <p>Best,</p>
          <p><b>Blood Bridge Team</b></p>
        </body>
      </html>`

    const emailPromise = sendEmail({
      email: user?.email,
      subject: 'Blood Bridge: Blood Type Request',
      message: html,
    })

    await Promise.all([emailPromise])
  }
}

// EMAIL BLOOD BANKS -
const emailBloodBanks = async (bloodBanks, bloodType, bloodBank) => {
  const location = `${bloodBank?.sector}, ${bloodBank?.address}, ${bloodBank?.city}`

  for (const bank of bloodBanks) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Blood Bridge: Blood Donation Update</title>
        </head>
        <body>
          <p>Dear ${bank?.name},</p>

          <p>We'd like to inform you that <b>${bloodBank?.name}</b> needs <b>${bloodType?.bloodGroup}</b> blood type.</p>
          <p>If you are willing to donate, please contact at <b>${bloodBank?.contact}</b>.</p>
          <p><b>Location:</b> ${location}.</p>

          <p>Best,</p>
          <p><b>Blood Bridge Team</b></p>
        </body>
      </html>`

    const emailPromise = sendEmail({
      email: bank?.email,
      subject: 'Blood Bridge: Blood Type Request',
      message: html,
    })

    await Promise.all([emailPromise])
  }
}
