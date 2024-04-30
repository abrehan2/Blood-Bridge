// IMPORTS -
const {
  registerUser,
  getUserDetails,
  userFeedBack,
  viewBloodBank,
  getUserLocation,
  deactivateAccount,
  getBloodBanks,
  getAllUsers,
  viewUser,
  blockUser,
  deleteUser,
  deleteReview,
} = require('../../controllers/userController')
const userSchema = require('../../models/userModel')
const bloodBankSchema = require('../../models/bloodBankModel')
const bloodGroupSchema = require('../../models/BloodGroupModel')
const reviewSchema = require('../../models/reviewModel')
const ErrorHandler = require('../../utils/errorHandler')
const { getEvents } = require('../../utils/location')

// PARTIALS -
jest.mock('../../models/userModel')
jest.mock('../../utils/errorHandler')
jest.mock('../../models/bloodBankModel')
jest.mock('../../models/BloodGroupModel')
jest.mock('../../models/bloodRequestModel')
jest.mock('../../models/bloodDonationModel')
jest.mock('../../models/reviewModel')
jest.mock('../../utils/location')

const imageBuffer = 'https://utfs.io/f/d7cfaa2b-ee7b-47eb-8963-1f41ab93b88f-nest39.webp'
const mockData = {
  firstName: 'Abdul',
  lastName: 'Rehan',
  email: 'rehannajam2@gmail.com',
  cnic: '61101-8555681-9',
  city: 'Islamabad',
  dob: '26-01-24',
  password: 'chainsmokers',
  bloodGroup: 'B+',
  contact: '0301-5223445',
  avatar: imageBuffer,
  location: {
    type: 'Point',
    coordinates: [0, 0],
  },
}

const request = {
  body: mockData,
}

const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
}

const next = jest.fn()

describe('Register User', () => {
  
  it('Registration fails on existing user, returning status code 400', async () => {
    userSchema.findOne.mockImplementationOnce(() => ({
      id: Math.floor(Math.random() * Date.now()),
      email: 'rehannajam2@gmail.com',
    }))
    await registerUser(request, response, next)
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })

  it('Create User', async () => {
    userSchema.create.mockResolvedValueOnce(mockData)

    await registerUser(request, response, next)

    expect(userSchema.create).toHaveBeenCalledWith(request.body)
  })
})

it('Should return user details when user is logged in', async () => {
  const userId = Math.floor(Math.random() * Date.now())
  const loggedInUser = mockData

  const req = {
    authUser: {
      id: userId,
    },
  }
  userSchema.findById = jest.fn().mockResolvedValue(loggedInUser)

  await getUserDetails(req, response, next)

  expect(userSchema.findById).toHaveBeenCalledWith(userId)
  expect(response.status).toHaveBeenCalledWith(200)
})

it('User Feedback', async () => {
  const req = {
    body: {
      feedback: 'Great experience! Keep up the good work.',
    },
    authUser: {
      id: Math.floor(Math.random() * Date.now()),
    },
  }

  const user = {
    feedback: [],
    save: jest.fn().mockResolvedValueOnce(),
  }
  userSchema.findById = jest.fn().mockResolvedValueOnce(user)

  await userFeedBack(req, response, next)

  expect(userSchema.findById).toHaveBeenCalledWith(req.authUser.id)
  expect(user.feedback).toContain(req.body.feedback)
  expect(user.save).toHaveBeenCalled()
  expect(next).not.toHaveBeenCalled()
})

describe('View Blood Bank', () => {
  
  it('Should return blood bank details with associated blood groups', async () => {
    const req = {
      params: {
        id: Math.floor(Math.random() * Date.now()),
      },
    }

    const bloodBank = {
      _id: '123',
      name: 'Example Blood Bank',
    }

    const bloodGroups = [
      { _id: 'group1', name: 'A+' },
      { _id: 'group2', name: 'B+' },
    ]

    bloodBankSchema.findById = jest.fn().mockResolvedValueOnce(bloodBank)

    bloodGroupSchema.find = jest.fn().mockResolvedValueOnce(bloodGroups)

    await viewBloodBank(req, response, next)

    expect(bloodBankSchema.findById).toHaveBeenCalledWith(req.params.id)
    expect(bloodGroupSchema.find).toHaveBeenCalledWith({ bloodBank: req.params.id })
    expect(next).not.toHaveBeenCalled()
  })

  it('Should handle blood bank not found', async () => {
    const req = {
      params: {
        id: 'invalidId',
      },
    }

    bloodBankSchema.findById = jest.fn().mockResolvedValueOnce(null)

    await viewBloodBank(req, response, next)

    expect(bloodBankSchema.findById).toHaveBeenCalledWith(req.params.id)
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
    expect(response.status).not.toHaveBeenCalled()
    expect(response.json).not.toHaveBeenCalled()
  })
})

describe('Get User Location', () => {
  
  it('Should handle user location retrieval and update successfully', async () => {
    const req = { authUser: { id: 'userId' } }

    const user = { location: { coordinates: [0, 0] }, save: jest.fn() }
    const latitude = 40.7128
    const longitude = -74.006
    const event = 'Success'

    userSchema.findById.mockResolvedValue(user)
    getEvents.mockReturnValue({ latitude, longitude, event })

    await getUserLocation(req, response, next)

    expect(userSchema.findById).toHaveBeenCalledWith('userId')
    expect(getEvents).toHaveBeenCalled()
    expect(user.location.coordinates[0]).toBe(longitude)
    expect(user.location.coordinates[1]).toBe(latitude)
    expect(user.save).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
})

describe('Deactivate Account', () => {
  
  it('should deactivate the user account successfully', async () => {
    const req = { authUser: { id: 'userId' } }
    const res = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    const updatedUser = { isActive: false }
    userSchema.findByIdAndUpdate.mockResolvedValue(updatedUser)

    await deactivateAccount(req, res, next)

    expect(userSchema.findByIdAndUpdate).toHaveBeenCalledWith(
      'userId',
      { isActive: false },
      { new: true, runValidators: true, useFindAndModify: false },
    )
    expect(res.cookie).toHaveBeenCalledWith('token', null, {
      expires: expect.any(Date),
      httpOnly: true,
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Your account has been deactivated',
    })
    expect(next).not.toHaveBeenCalled()
  })
})

describe('Get Blood Banks', () => {
  
  it('should retrieve blood banks and their associated blood groups successfully', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    const bloodBank1 = { _id: 'bankId1', name: 'Bank 1', status: 'open' }
    const bloodBank2 = { _id: 'bankId2', name: 'Bank 2', status: 'open' }
    const bloodBanks = [bloodBank1, bloodBank2]

    const bloodGroup1 = { bloodBank: 'bankId1', type: 'A+' }
    const bloodGroup2 = { bloodBank: 'bankId2', type: 'B-' }
    const bloodGroup3 = { bloodBank: 'bankId1', type: 'AB+' }
    const bloodGroup4 = { bloodBank: 'bankId1', type: 'O-' }
    const bloodGroups = [bloodGroup1, bloodGroup2, bloodGroup3, bloodGroup4]

    bloodBankSchema.find.mockResolvedValue(bloodBanks)
    bloodGroupSchema.find.mockResolvedValue(bloodGroups)

    await getBloodBanks({}, res)

    expect(bloodBankSchema.find).toHaveBeenCalledWith({ status: 'open' })
    expect(bloodGroupSchema.find).toHaveBeenCalled()
  })
})

describe('Get All Users', () => {
  it('Should retrieve all users successfully excluding the authenticated user', async () => {
    const req = { authUser: { id: 'authenticatedUserId' } }

    const users = [
      { _id: 'userId1', name: 'User 1' },
      { _id: 'userId2', name: 'User 2' },
    ]

    userSchema.find.mockResolvedValue(users)

    await getAllUsers(req, response)

    expect(userSchema.find).toHaveBeenCalledWith({
      _id: { $ne: 'authenticatedUserId' },
    })
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({ success: true, users })
  })
})

describe('View User', () => {
  it('Should retrieve user information successfully', async () => {
    const req = { params: { id: 'userId' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    const user = { _id: 'userId', name: 'Test User' }

    userSchema.findById.mockResolvedValue(user)

    await viewUser(req, res, next)

    expect(userSchema.findById).toHaveBeenCalledWith('userId')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, user })
    expect(next).not.toHaveBeenCalled()
  })

  it('Should handle user not found', async () => {
    const req = { params: { id: 'nonExistingUserId' } }

    userSchema.findById.mockResolvedValue(null)

    await viewUser(req, response, next)

    expect(userSchema.findById).toHaveBeenCalledWith('nonExistingUserId')
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })
})

describe('Block User', () => {
  it('should block user successfully', async () => {
    const req = {
      params: { id: 'userId' },
      body: { status: 'blocked' },
    }

    const user = {
      _id: 'userId',
      firstName: 'Test',
      lastName: 'User',
      save: jest.fn().mockResolvedValue({}),
    }

    userSchema.findById.mockResolvedValue(user)

    await blockUser(req, response, next)

    expect(userSchema.findById).toHaveBeenCalledWith('userId')
    expect(user.block).toBe(true)
    expect(user.save).toHaveBeenCalledWith({ validateBeforeSave: false })
    expect(next).not.toHaveBeenCalled()
  })

  it('Should unblock user successfully', async () => {
    const req = {
      params: { id: 'userId' },
      body: { status: 'unblocked' },
    }

    const user = {
      _id: 'userId',
      firstName: 'Test',
      lastName: 'User',
      save: jest.fn().mockResolvedValue({}),
    }

    userSchema.findById.mockResolvedValue(user)

    await blockUser(req, response, next)

    expect(userSchema.findById).toHaveBeenCalledWith('userId')
    expect(user.block).toBe(false)
    expect(user.save).toHaveBeenCalledWith({ validateBeforeSave: false })
    expect(next).not.toHaveBeenCalled()
  })

  it('Should handle user not found', async () => {
    const req = {
      params: { id: 'nonExistingUserId' },
      body: { status: 'blocked' },
    }

    userSchema.findById.mockResolvedValue(null)

    await blockUser(req, response, next)

    expect(userSchema.findById).toHaveBeenCalledWith('nonExistingUserId')
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })
})

describe('Delete User', () => {
  it('Should delete user successfully', async () => {
    const req = { params: { id: 'userId' } }

    const user = {
      _id: 'userId',
      deleteOne: jest.fn().mockResolvedValue({}),
    }

    userSchema.findById.mockResolvedValue(user)

    await deleteUser(req, response, next)

    expect(userSchema.findById).toHaveBeenCalledWith('userId')
    expect(user.deleteOne).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('Should handle user not found', async () => {
    const req = { params: { id: 'nonExistingUserId' } }
    const res = {}
    const next = jest.fn()

    userSchema.findById.mockResolvedValue(null)

    await deleteUser(req, res, next)

    expect(userSchema.findById).toHaveBeenCalledWith('nonExistingUserId')
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })
})

describe('Delete Review', () => {
  it('Should delete review successfully', async () => {
    const req = { params: { id: 'reviewId' } }

    const review = {
      _id: 'reviewId',
      deleteOne: jest.fn().mockResolvedValue({}),
    }

    reviewSchema.findById.mockResolvedValue(review)

    await deleteReview(req, response, next)

    expect(reviewSchema.findById).toHaveBeenCalledWith('reviewId')
    expect(review.deleteOne).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('Should handle review not found', async () => {
    const req = { params: { id: 'nonExistingReviewId' } }

    reviewSchema.findById.mockResolvedValue(null)

    await deleteReview(req, response, next)

    expect(reviewSchema.findById).toHaveBeenCalledWith('nonExistingReviewId')
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })
})
