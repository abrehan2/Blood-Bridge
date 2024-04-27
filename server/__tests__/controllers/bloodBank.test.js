// IMPORTS -
const bloodBankSchema = require('./../../models/bloodBankModel')
const verificationSchema = require('./../../models/verificationModel')
const bloodRequestSchema = require('./../../models/bloodRequestModel')
const bloodDonationSchema = require('./../../models/bloodDonationModel')
const ErrorHandler = require('./../../utils/errorHandler')
const httpMocks = require('node-mocks-http')
const {
  registerBloodBank,
  verifyBloodBank,
  loginBloodBank,
  getBloodBank,
  getAllBloodBanks,
  viewBloodBank,
  blockBloodBank,
  deleteBloodBank,
  getBloodRequests,
  getBloodDonations,
} = require('../../controllers/bloodBankController')

// PARTIALS -
jest.mock('./../../models/bloodBankModel')
jest.mock('./../../models/verificationModel')
jest.mock('./../../models/reviewModel')
jest.mock('./../../models/bloodRequestModel')
jest.mock('./../../utils/errorHandler')
jest.mock('./../../models/bloodDonationModel')

const imageBuffer = 'https://utfs.io/f/d7cfaa2b-ee7b-47eb-8963-1f41ab93b88f-nest39.webp'

const mockData = {
  name: 'Health Blood House',
  email: 'healthBloodHouse@gmail.com',
  password: 'password',
  licenseNo: 123,
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

describe('Register Blood Bank', () => {
  it('Registration fails on existing blood bank, returning status code 400', async () => {
    bloodBankSchema.findOne.mockImplementationOnce(() => ({
      id: Math.floor(Math.random() * Date.now()),
      email: 'email',
    }))
    await registerBloodBank(request, response, next)
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })

  it('Create Blood Bank', async () => {
    bloodBankSchema.create(mockData)

    await registerBloodBank(request, response, next)

    expect(bloodBankSchema.create).toHaveBeenCalledWith(request.body)
  })
})

describe('Verify Blood Bank', () => {
  let req

  beforeEach(() => {
    req = {
      params: {
        id: 'some-id',
        token: 'some-token',
      },
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should verify the email address successfully', async () => {
    bloodBankSchema.findOne.mockResolvedValue({ _id: req.params.id, updateOne: jest.fn() })
    verificationSchema.findOne.mockResolvedValue({ deleteOne: jest.fn() })

    await verifyBloodBank(req, response, next)

    expect(bloodBankSchema.findOne).toHaveBeenCalledWith({ _id: req.params.id })
    expect(verificationSchema.findOne).toHaveBeenCalledWith({
      BloodBankId: req.params.id,
      token: req.params.token,
    })
  })

  test('Should return error if blood bank does not exist', async () => {
    bloodBankSchema.findOne.mockResolvedValue(null)

    await verifyBloodBank(req, response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })
})

describe('Login', () => {
  let mockRequest

  beforeEach(() => {
    mockRequest = {
      body: {
        licenseNo: request.body.licenseNo,
        password: request.body.password,
      },
    }
  })

  test('Should require license number and password', async () => {
    mockRequest.body = {}

    await loginBloodBank(mockRequest, response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
  })
})

describe('Get Blood Bank Details', () => {
  test('Should respond with status 200 and blood bank data', async () => {
    const mockBloodBankData = {
      _id: 'mockBloodBankId',
      name: 'Mock Blood Bank',
    }

    const req = httpMocks.createRequest({
      authUser: { id: 'mockUserId' },
    })
    const res = httpMocks.createResponse()

    bloodBankSchema.findById = jest.fn().mockResolvedValue(mockBloodBankData)

    await getBloodBank(req, res)

    expect(res.statusCode).toBe(200)

    expect(res._getJSONData().success).toBe(true)

    expect(res._getJSONData().bloodBank).toEqual(mockBloodBankData)

    expect(bloodBankSchema.findById).toHaveBeenCalledWith('mockUserId')
  })
})

describe('Get Blood Banks For Admin', () => {
  it('Should return all blood banks', async () => {
    const mockBloodBanks = [
      {
        /* mock blood bank object */
      },
      {
        /* mock blood bank object */
      },
    ]
    bloodBankSchema.find.mockResolvedValueOnce(mockBloodBanks)

    await getAllBloodBanks(request, response)

    expect(bloodBankSchema.find).toHaveBeenCalledWith()
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({ success: true, bloodBanks: mockBloodBanks })
  })
})

describe('View Blood Bank For Admin', () => {
  it('Should return the blood bank if found', async () => {
    const mockBloodBank = { _id: 'someId', name: 'Test Blood Bank' }
    const req = { params: { id: 'someId' } }

    bloodBankSchema.findById = jest.fn().mockResolvedValue(mockBloodBank)

    await viewBloodBank(req, response, next)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      bloodBank: mockBloodBank,
    })
  })

  it('Should call next with error if blood bank not found', async () => {
    const req = { params: { id: 'someId' } }

    bloodBankSchema.findById = jest.fn().mockResolvedValue(null)

    await viewBloodBank(req, response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
    expect(response.status).not.toHaveBeenCalled()
    expect(response.json).not.toHaveBeenCalled()
  })
})

describe('Block Blood Bank For Admin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should block the blood bank successfully', async () => {
    const req = { params: { id: 'someId' }, body: { status: 'blocked' } };
   
    const bloodBank = { _id: 'someId', name: 'Test Blood Bank', block: false };
    bloodBankSchema.findById = jest.fn().mockResolvedValue(bloodBank);
    bloodBank.save = jest.fn().mockResolvedValue(bloodBank);

    await blockBloodBank(req, response, next);

    expect(bloodBank.save).toHaveBeenCalledWith({ validateBeforeSave: false });
  });

  it('Should unblock the blood bank successfully', async () => {
    const req = { params: { id: 'someId' }, body: { status: 'unblocked' } };

    const bloodBank = { _id: 'someId', name: 'Test Blood Bank', block: true };
    bloodBankSchema.findById = jest.fn().mockResolvedValue(bloodBank);
    bloodBank.save = jest.fn().mockResolvedValue(bloodBank);

    await blockBloodBank(req, response, next);

    expect(bloodBank.save).toHaveBeenCalledWith({ validateBeforeSave: false });

  });

  it('Should return error if status is missing', async () => {
    const req = { params: { id: 'someId' }, body: {} };

    await blockBloodBank(req, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });

  it('Should return error if blood bank not found', async () => {
    const req = { params: { id: 'someId' }, body: { status: 'blocked' } };
   

    bloodBankSchema.findById = jest.fn().mockResolvedValue(null);

    await blockBloodBank(req, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });
});

describe('Delete Blood Bank For Admin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should delete the blood bank successfully', async () => {
    const req = { params: { id: 'someId' } };

    const bloodBank = { _id: 'someId', name: 'Test Blood Bank' };
    bloodBankSchema.findById = jest.fn().mockResolvedValue(bloodBank);
    bloodBank.deleteOne = jest.fn().mockResolvedValue({});

    await deleteBloodBank(req, response, next);

    expect(bloodBank.deleteOne).toHaveBeenCalled();
  
  });

  it('Should return error if blood bank not found', async () => {
    const req = { params: { id: 'someId' } };

    bloodBankSchema.findById = jest.fn().mockResolvedValue(null);

    await deleteBloodBank(req, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });
});

describe('Get Blood Requests For Admin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should retrieve blood requests successfully', async () => {
    const req = {};

    const bloodRequests = [
      { _id: '1', bloodBank: { name: 'Blood Bank 1' }, bloodGroup: { name: 'AB+' } },
      { _id: '2', bloodBank: { name: 'Blood Bank 2' }, bloodGroup: { name: 'O-' } },
    ];

    bloodRequestSchema.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(bloodRequests),
    });

    await getBloodRequests(req, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      bloodRequests: [
        { _id: '1', bloodBank: { name: 'Blood Bank 1' }, bloodGroup: { name: 'AB+' } },
        { _id: '2', bloodBank: { name: 'Blood Bank 2' }, bloodGroup: { name: 'O-' } },
      ],
    });
  });
});

describe('Get Blood Donations For Admin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should retrieve blood donations successfully', async () => {
    const req = {};

    const bloodDonations = [
      { _id: '1', bloodBank: { name: 'Blood Bank 1' }, bloodGroup: { name: 'AB+' } },
      { _id: '2', bloodBank: { name: 'Blood Bank 2' }, bloodGroup: { name: 'O-' } },
    ];

    bloodDonationSchema.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(bloodDonations),
    });

    await getBloodDonations(req, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      bloodDonations: [
        { _id: '1', bloodBank: { name: 'Blood Bank 1' }, bloodGroup: { name: 'AB+' } },
        { _id: '2', bloodBank: { name: 'Blood Bank 2' }, bloodGroup: { name: 'O-' } },
      ],
    });
  });
});