// IMPORTS -
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErr = require('../middlewares/catchAsyncErr')
const userModel = require('../models/userModel')
const verificationModel = require('../models/verificationModel')
const bloodBankModel = require('../models/bloodBankModel')
const reviewModel = require('../models/reviewModel')
const bloodRequestModel = require('../models/bloodRequestModel')
const bloodDonationModel = require('../models/bloodDonationModel')
const bloodGroup = require('../models/bloodGroupModel')
const crypto = require('crypto')
const sendEmail = require('../utils/email')
const bloodGroupModel = require('../models/bloodGroupModel')
const { getEvents } = require('../utils/location')

// PARTIALS -
const imageBuffer = 'https://utfs.io/f/d7cfaa2b-ee7b-47eb-8963-1f41ab93b88f-nest39.webp'

// REGISTER USER -
exports.registerUser = catchAsyncErr(async (req, res, next) => {
  const { firstName, lastName, email, cnic, city, dob, password, bloodGroup, contact } = req.body

  let user = await userModel.findOne({ email })

  if (user) {
    return next(new ErrorHandler('The email address you entered is already in use', 400))
  }

  user = await userModel.create({
    firstName,
    lastName,
    email,
    cnic,
    bloodGroup,
    city,
    dob,
    password,
    avatar: imageBuffer,
    contact,
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
  })

  const token = await new verificationModel({
    userId: user._id,
    token: crypto.randomBytes(32).toString('hex'),
    purpose: 'accountVerify',
  }).save()

  const url = `${process.env.BASE_URL}/auth/user/${user.id}/verify/${token.token}`

  await sendEmail({
    email: user.email,
    subject: 'Blood Bridge Account Verification',
    message: `Click the given link to verify your account: ${url}`,
  })

  res.status(201).json({
    success: true,
    message: 'Your account has been created! Please verify your email address to log in',
  })
})

// VERIFY USER -
exports.verifyUser = catchAsyncErr(async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.params.id })

  if (!user) {
    return next(new ErrorHandler('Invalid email verification link', 400))
  }

  const token = await verificationModel.findOne({
    userId: user._id,
    token: req.params.token,
  })

  if (!token) {
    return next(new ErrorHandler('Invalid email verification link', 400))
  }

  await user.updateOne({ verified: true })
  await token.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Thank you for verifying your email address',
  })
})

// LOGIN USER -
exports.loginUser = catchAsyncErr(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler('Please enter the email and password', 400))
  }

  const user = await userModel.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorHandler('Your email or password is incorrect', 401))
  }

  if (user.block === true) {
    return next(
      new ErrorHandler(
        "We've temporarily restricted your account access. Please reach out to our support team for further assistance",
        403,
      ),
    )
  }

  if (user.isActive === false) {
    user.isActive = true
  }

  if (!user.verified) {
    let token = await verificationModel.findOne({ userId: user._id })

    if (!token) {
      token = await new verificationModel({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
        purpose: 'accountVerify',
      }).save()

      const url = `${process.env.BASE_URL}/auth/user/${user.id}/verify/${token.token}`

      await sendEmail({
        email: user.email,
        subject: 'Blood Bridge Account Verification',
        message: `Click the given link to verify your account: ${url}`,
      })
    }
    return next(new ErrorHandler('Activate your account by clicking the link in the email', 403))
  }

  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Your email or password is incorrect', 401))
  }

  // SAVING COORDINATES -
  const { longitude, latitude } = getEvents()

  user.location = {
    type: 'Point',
    coordinates: [Number(longitude), Number(latitude)],
  }

  await user.save({ validateBeforeSave: true })
  const token = user.getJsonWebToken()

  res.status(200).json({
    success: true,
    message: 'You are logged in!',
    token,
    user,
  })
})

// GENERATE TOKEN FOR FORGOT PASSWORD -
exports.forgotPassword = catchAsyncErr(async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    return next(new ErrorHandler('Please enter the email', 400))
  }

  const user = await userModel.findOne({ email })

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  const url = `${process.env.BASE_URL}/auth/user/reset/${resetToken}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Blood Bridge password reset verification',
      message: `Click the given link to change your password: ${url}`,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    })
  } catch (err) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(err.message, 500))
  }
})

// RESET PASSWORD -
exports.resetPassword = catchAsyncErr(async (req, res, next) => {
  const { password, confirmPassword } = req.body
  const token = req.params.token

  if (!password || !confirmPassword) {
    return next(new ErrorHandler('Please enter your password and confirm password', 400))
  }

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  })

  if (!user) {
    return next(new ErrorHandler('Your password reset link is invalid or expired', 400))
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords don't match", 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()
  res.status(200).json({
    success: true,
    message: 'Your password has been changed',
  })
})

// GET USER DETAILS -
exports.getUserDetails = catchAsyncErr(async (req, res) => {
  const user = await userModel.findById(req.authUser.id)

  res.status(200).json({
    success: true,
    user,
  })
})

// UPDATE USER PASSWORD -
exports.updatePassword = catchAsyncErr(async (req, res, next) => {
  const { oldPassword, confirmPassword, newPassword } = req.body

  if (!oldPassword || !confirmPassword || !newPassword) {
    return next(new ErrorHandler('Please fill in all required fields', 400))
  }

  const user = await userModel.findById(req.authUser.id).select('+password')
  const isPasswordMatched = await user.comparePassword(oldPassword)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Your old password is incorrect', 400))
  }

  if (confirmPassword !== newPassword) {
    return next(new ErrorHandler("Passwords don't match", 400))
  }

  if (newPassword === oldPassword) {
    return next(new ErrorHandler('Please use a different password', 400))
  }

  user.password = newPassword
  await user.save()

  // const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    message: 'Password has been updated',
  })
})

// UPDATE PROFILE -
exports.updateProfile = catchAsyncErr(async (req, res, next) => {
  const user = await userModel.findById(req.authUser.id)

  const newUserData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    city: req.body.city,
    cnic: req.body.cnic,
    contact: req.body.contact,
    bloodGroup: req.body.bloodGroup,
    email: req.body.email,
    avatar: req.body.avatar,
  }

  if (req.body.email !== undefined) {
    if (
      (req.body.email === user.email && user.emailVerified === true) ||
      (req.body.email === user.email && user.emailVerified === null)
    ) {
      return next(new ErrorHandler('Your email is already verified', 403))
    }

    if (user.emailVerified === false) {
      return next(new ErrorHandler('Confirm your email address', 403))
    }

    const emailExists = await userModel.findOne({ email: req.body.email })
    if (emailExists) {
      return next(new ErrorHandler('Please use a different email address', 400))
    }

    const token = await new verificationModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
      purpose: 'emailVerify',
    })

    user.emailVerified = false
    await Promise.all([token.save(), user.save()])

    const url = `${process.env.BASE_URL}/user/${user.id}/verify/${token.token}`

    await sendEmail({
      email: req.body.email,
      subject: 'Blood Bridge Email Verification',
      message: `Click the given link to verify your email: ${url}`,
    })
  }

  const updated_user = await userModel.findByIdAndUpdate(req.authUser.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    message: 'Your profile changes have been saved',
    updated_user,
  })
})

// VERIFY UPDATED EMAIL -
exports.verifyEmail = catchAsyncErr(async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.params.id })
  const token = await verificationModel.findOne({
    userId: user._id,
    token: req.params.token,
  })

  if (!user) {
    return next(new ErrorHandler('Invalid email verification link', 400))
  }

  if (!token) {
    return next(new ErrorHandler('Invalid email verification link', 400))
  }

  await user.updateOne({ _id: user._id, emailVerified: true })
  await token.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Thank you for verifying your email address',
  })
})

// RESEND EMAIL VERIFICATION FOR UPDATED AN EMAIL -
exports.resendEmailVerification = catchAsyncErr(async (req, res, next) => {
  const user = await userModel.findById(req.authUser.id)
  const token = await verificationModel.findOne({ userId: user._id })

  if (user.emailVerified || user.emailVerified === null) {
    return next(new ErrorHandler('Your email is already verified', 403))
  }

  if (token === null) {
    const newToken = await verificationModel.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
      purpose: 'emailVerify',
    })

    const url = `${process.env.BASE_URL}/user/${user.id}/verify/${newToken.token}`

    await sendEmail({
      email: user.email,
      subject: 'Blood Bridge Email Verification',
      message: `Click the given link to verify your email: ${url}`,
    })

    return res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    })
  }

  return next(new ErrorHandler('Activate your email by clicking the link in the email', 403))
})

// GIVE FEEDBACK -
exports.userFeedBack = catchAsyncErr(async (req, res, next) => {
  const { feedback } = req.body
  const user = await userModel.findById(req.authUser.id)

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  user.feedback.push(feedback)
  await user.save()

  res.status(200).json({
    success: true,
    message: "We appreciate your feedback. We're always looking for ways to improve!",
  })
})

// VIEW BLOOD BANK -
exports.viewBloodBank = catchAsyncErr(async (req, res, next) => {
  const bloodBank = await bloodBankModel.findById(req.params.id)

  if (!bloodBank) {
    return next(new ErrorHandler('Blood bank not found', 404))
  }

  const bloodGroups = await bloodGroupModel.find({ bloodBank: req.params.id })

  res.status(200).json({
    success: true,
    bloodBank: {
      ...bloodBank._doc,
      bloodGroups: bloodGroups,
    },
  })
})

// GET USER COORDINATES -
exports.getUserLocation = catchAsyncErr(async (req, res, next) => {
  const user = await userModel.findById(req.authUser.id)
  const { latitude, longitude, event } = getEvents()

  if (event === 'Error') {
    return next(new ErrorHandler('User denied the access to location', 404))
  }

  if (latitude === '' || longitude === '' || event === '') {
    return next(new ErrorHandler('Please refresh your window', 404))
  }

  if (user.location.coordinates[0] !== longitude && user.location.coordinates[1] !== latitude) {
    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    }

    await user.save({ validateBeforeSave: true })
  }

  res.status(200).json({
    success: true,
  })
})

// DEACTIVATE USER ACCOUNT -
exports.deactivateAccount = catchAsyncErr(async (req, res, next) => {
  const id = req.authUser.id

  const updatedUser = await userModel.findByIdAndUpdate(
    id,
    {
      isActive: false,
    },

    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    },
  )

  if (!updatedUser) {
    return next(new ErrorHandler('User not found', 404))
  }

  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: 'Your account has been deactivated',
  })
})

// GET ALL BLOOD BANKS -
exports.getBloodBanks = catchAsyncErr(async (req, res) => {
  const bloodBanks = await bloodBankModel.find({ status: 'open' })
  const bloodTypes = await bloodGroup.find()
  const formatBloodBanks = new Map()

  bloodBanks.forEach((bank) => {
    const bloodGroupsForBank = bloodTypes.filter(
      (type) => type?.bloodBank.toString() === bank?._id.toString(),
    )

    if (bloodGroupsForBank.length > 0) {
      formatBloodBanks.set(bank?._id.toString(), {
        bloodBank: bank,
        bloodGroups: bloodGroupsForBank,
      })
    } else {
      formatBloodBanks.set(bank?._id.toString(), {
        bloodBank: bank,
        bloodGroups: null,
      })
    }
  })

  const result = Array.from(formatBloodBanks.values())

  res.status(200).json({
    success: true,
    result,
  })
})

// REVIEW A BLOOD BANK -
exports.reviewBloodBank = catchAsyncErr(async (req, res, next) => {
  const { comment, bloodBankId } = req.body

  if (!comment) {
    return next(new ErrorHandler('Please fill in all required fields', 400))
  }

  const bloodBank = await bloodBankModel.findById(bloodBankId)

  if (!bloodBank) {
    return next(new ErrorHandler('Blood bank found', 404))
  }

  const lastReview = await reviewModel
    .findOne({ user: req.authUser.id, bloodBank: bloodBankId })
    .sort({ createdAt: -1 })

  if (!lastReview) {
    await reviewModel.create({
      comment,
      user: req.authUser.id,
      bloodBank,
    })

    return res.status(201).json({
      success: true,
      message: `Your first review has been submitted to ${bloodBank.name}`,
    })
  }

  const bloodRequest = await bloodRequestModel.findOne({
    user: req.authUser.id,
    createdAt: { $gte: lastReview?.createdAt.getTime() },
  })

  const bloodDonation = await bloodDonationModel.findOne({
    user: req.authUser.id,
    createdAt: { $gte: lastReview?.createdAt.getTime() },
  })

  console.log(bloodDonation, bloodRequest)

  if (!bloodRequest && !bloodDonation) {
    return next(
      new ErrorHandler(
        'You must make a new blood request or donation before reviewing the blood bank again',
        400,
      ),
    )
  }

  await reviewModel.create({
    comment,
    user: req.authUser.id,
    bloodBank,
  })

  res.status(201).json({
    success: true,
    message: `Your review has been submitted to ${bloodBank.name}`,
  })
})

///////////////////////////////////////////////// ADMIN ROUTES ///////////////////////////////////////////////////

// GET ALL USERS -
exports.getAllUsers = catchAsyncErr(async (req, res) => {
  const users = await userModel.find({
    _id: { $ne: req.authUser.id },
  })

  res.status(200).json({
    success: true,
    users,
  })
})

// VIEW ANY USER -
exports.viewUser = catchAsyncErr(async (req, res, next) => {
  const user = await userModel.findById(req.params.id)

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  res.status(200).json({
    success: true,
    user,
  })
})

// BLOCK USER -
exports.blockUser = catchAsyncErr(async (req, res, next) => {
  const { status } = req.body
  const user = await userModel.findById(req.params.id)
  let flag = ''

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  if (status === 'blocked') {
    user.block = true
    flag = 'blocked'
  }

  if (status === 'unblocked') {
    user.block = false
    flag = 'unblocked'
  }

  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    message: `${user.firstName} ${user.lastName} has been ${flag}`,
  })
})

// DELETE USER -
exports.deleteUser = catchAsyncErr(async (req, res, next) => {
  const user = await userModel.findById(req.params.id)

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  await user.deleteOne()
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  })
})

// GET ALL REVIEWS -
exports.getAllReviews = catchAsyncErr(async (req, res) => {
  const reviews = await reviewModel.find().populate('bloodBank', 'name')

  res.status(200).json({
    success: true,
    reviews,
  })
})

// DELETE A REVIEW -
exports.deleteReview = catchAsyncErr(async (req, res, next) => {
  const review = await reviewModel.findById(req.params.id)

  if (!review) {
    return next(new ErrorHandler('Review not found', 404))
  }

  await review.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  })
})
