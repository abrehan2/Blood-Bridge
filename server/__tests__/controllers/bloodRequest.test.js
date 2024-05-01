// IMPORTS -
const ErrorHandler = require('../../utils/errorHandler')
const { manualRequest, getUserBloodRequests } = require('../../controllers/bloodRequestController')
const bloodGroupSchema = require('../../models/bloodGroupModel')
const bloodRequestSchema = require('../../models/bloodRequestModel')

// PARTIALS -
jest.mock('../../models/bloodGroupModel')
jest.mock('../../models/bloodRequestModel')
jest.mock('../../utils/errorHandler')

describe('Manual Blood Request', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        contact: '1234567890',
        bloodGroup: 'A+',
        bloodBags: 2,
        bloodNeededOn: '2024-05-01',
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
    await manualRequest(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })

  it('Should create a blood request', async () => {
    const mockBloodGroup = {
      /* mock blood group data */
    }
    bloodGroupSchema.findOne.mockResolvedValue(mockBloodGroup)

    const mockBloodRequest = {
      /* mock blood request data */
    }
    bloodRequestSchema.create.mockResolvedValue(mockBloodRequest)

    await manualRequest(req, res, next)

    expect(bloodGroupSchema.findOne).toHaveBeenCalledWith({
      $and: [{ bloodGroup: req.body.bloodGroup }, { bloodBank: req.authUser.id }],
    })

    expect(bloodRequestSchema.create).toHaveBeenCalledWith({
      name: req.body.name,
      contact: req.body.contact,
      bloodBank: req.authUser.id,
      bloodGroup: mockBloodGroup._id,
      bloodBags: req.body.bloodBags,
      bloodNeededOn: req.body.bloodNeededOn,
      requestType: 'Site',
      reqStatus: 'Completed',
    })
  })
})

describe('Get User Blood Requests', () => {
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

  it('Should retrieve user blood requests with population', async () => {
    const mockBloodRequests = [
      {
        /* mock blood request data */
      },
    ]

    bloodRequestSchema.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockBloodRequests),
    })

    await getUserBloodRequests(req, res)

    expect(bloodRequestSchema.find).toHaveBeenCalledWith({ user: req.authUser.id })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, bloodRequests: mockBloodRequests })
  })
})