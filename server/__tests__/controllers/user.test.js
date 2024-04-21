// IMPORTS -
const {
  registerUser,
  getUserDetails,
  userFeedBack,
  viewBloodBank,
  getUserLocation,
  deactivateAccount
} = require('../../controllers/userController')
const userSchema = require('../../models/userModel')
const bloodBankSchema = require('../../models/bloodBankModel')
const bloodGroupSchema = require('../../models/BloodGroupModel')
const ErrorHandler = require('../../utils/errorHandler')
const { getEvents } = require('../../utils/location')


// PARTIALS -
jest.mock('../../models/userModel');
jest.mock('../../utils/errorHandler')
jest.mock('../../models/bloodBankModel')
jest.mock('../../models/BloodGroupModel')
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
  status: jest.fn((x) => x),
  json: jest.fn((x) => x),
}

const next = jest.fn()

describe('Register User', () => {
  it('Registration fails on existing user, returning status code 400', async () => {
    userSchema.findOne.mockImplementationOnce(() => ({
      id: Math.floor(Math.random() * Date.now()),
      email: 'email',
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

  it('should handle user location retrieval and update successfully', async () => {
    const req = { authUser: { id: 'userId' } };

    const user = { location: { coordinates: [0, 0] }, save: jest.fn() };
    const latitude = 40.7128;
    const longitude = -74.0060;
    const event = 'Success';

    userSchema.findById.mockResolvedValue(user);
    getEvents.mockReturnValue({ latitude, longitude, event });

    await getUserLocation(req, response, next);

    expect(userSchema.findById).toHaveBeenCalledWith('userId');
    expect(getEvents).toHaveBeenCalled();
    expect(user.location.coordinates[0]).toBe(longitude);
    expect(user.location.coordinates[1]).toBe(latitude);
    expect(user.save).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

});

describe('Deactivate Account', () => {
  it('should deactivate the user account successfully', async () => {
    const req = { authUser: { id: 'userId' } };
    const res = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const updatedUser = { isActive: false };
    userSchema.findByIdAndUpdate.mockResolvedValue(updatedUser);

    await deactivateAccount(req, res, next);

    expect(userSchema.findByIdAndUpdate).toHaveBeenCalledWith(
      'userId',
      { isActive: false },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    expect(res.cookie).toHaveBeenCalledWith('token', null, { expires: expect.any(Date), httpOnly: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Your account has been deactivated' });
    expect(next).not.toHaveBeenCalled();
  });
})