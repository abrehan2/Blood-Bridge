// IMPORTS -
const {
  registerUser,
  getUserDetails,
  userFeedBack,
  viewBloodBank,
} = require('../../controllers/userController')
const userSchema = require('../../models/userModel')
const bloodBankSchema = require('../../models/bloodBankModel')
const bloodGroupSchema = require('../../models/BloodGroupModel')
const ErrorHandler = require('../../utils/errorHandler')

// PARTIALS -
jest.mock('../../models/userModel')
jest.mock('../../utils/errorHandler')
jest.mock('../../models/bloodBankModel')
jest.mock('../../models/BloodGroupModel')

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
  status: jest.fn((x) => x),
  json: jest.fn((x) => x),
}

const next = jest.fn()

describe('Register user', () => {
  it('Registration fails on existing user, returning status code 400', async () => {
    userSchema.findOne.mockImplementationOnce(() => ({
      id: Math.floor(Math.random() * Date.now()),
      email: 'email',
    }))
    await registerUser(request, response, next)
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })

  it('Create user', async () => {
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

it('User feedback', async () => {
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
  it('should return blood bank details with associated blood groups', async () => {
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

  it('should handle blood bank not found', async () => {
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
