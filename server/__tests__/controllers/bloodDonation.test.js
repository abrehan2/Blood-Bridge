// IMPORTS -
const {
  manualDonation,
  getBloodDonations,
  getUserBloodDonations,
} = require('../../controllers/bloodDonationController')
const ErrorHandler = require('../../utils/errorHandler')
const bloodDonationSchema = require('../../models/bloodDonationModel')

// PARTIALS -
jest.mock('../../models/bloodDonationModel')
jest.mock('../../utils/errorHandler')

describe('Manual Blood Donation', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        contact: '1234567890',
        age: 25,
        bloodGroup: 'A+',
        donationDate: '2024-05-01',
        disease: 'None',
      },
      authUser: {
        id: 'user-id',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should return 400 if required fields are missing', async () => {
    delete req.body.name
    await manualDonation(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })

  it('Should create a blood donation record', async () => {
    await manualDonation(req, res, next)
    expect(bloodDonationSchema.create).toHaveBeenCalledWith({
      name: req.body.name,
      contact: req.body.contact,
      age: req.body.age,
      bloodBank: req.authUser.id,
      bloodGroup: req.body.bloodGroup,
      disease: req.body.disease,
      donationDate: req.body.donationDate,
      donationType: 'Site',
      donationStatus: 'Completed',
    })

    expect(res.status).toHaveBeenCalledWith(201)
  })
})

describe('Get Blood Donations', () => {
  let req, res

  beforeEach(() => {
    req = {
      authUser: {
        id: 'user-id',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should retrieve blood donations for the logged-in blood bank user', async () => {
    const mockBloodDonations = [{}]
    bloodDonationSchema.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockBloodDonations),
    })

    await getBloodDonations(req, res)

    expect(bloodDonationSchema.find).toHaveBeenCalledWith({ bloodBank: req.authUser.id })
    expect(res.status).toHaveBeenCalledWith(200)
  })
})

describe('Get User Blood Donations', () => {
  let req, res

  beforeEach(() => {
    req = {
      authUser: {
        id: 'user-id',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should retrieve blood donations for the logged-in user with population', async () => {
    const mockBloodDonations = [
      {
        /* mock blood donation data */
      },
    ]

    bloodDonationSchema.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockBloodDonations),
      })

    await getUserBloodDonations(req, res)

    expect(bloodDonationSchema.find).toHaveBeenCalledWith({ user: req.authUser.id })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, bloodDonations: mockBloodDonations })
  })
})
