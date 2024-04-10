// IMPORTS -
const { registerUser } = require('../../controllers/userController')
const userSchema = require('../../models/userModel')
const ErrorHandler = require('../../utils/errorHandler')

// PARTIALS FOR USER REGISTRATION -
jest.mock('../../models/userModel')
jest.mock('../../models/verificationModel')
const imageBuffer = 'https://utfs.io/f/d7cfaa2b-ee7b-47eb-8963-1f41ab93b88f-nest39.webp'

const request = {
  body: {
    firstName: 'Abdul',
    lastName: 'Rehan',
    email: 'rehannajam2@gmail.com',
    cnic: '61101-8333683-7',
    city: 'Islamabad',
    dob: '26-01-24',
    password: 'oatsandmilk',
    bloodGroup: 'B+',
    contact: '0302-5493447',
    avatar: imageBuffer,
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
  },
}

const response = {
  status: jest.fn((x) => x),
  send: jest.fn((x) => x),
}

const next = jest.fn()

it('Registration fails on existing user, returning status code 400', async () => {
  userSchema.findOne.mockImplementationOnce(() => ({
    id: Math.floor(Math.random() * Date.now()),
    email: 'email',
  }))
  await registerUser(request, response, next)
  expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
})
