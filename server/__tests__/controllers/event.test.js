// IMPORTS -
const {
  createEvent,
  getAllEvents,
  getAdminEvents,
  getUserEvents,
} = require('../../controllers/eventController')
const eventSchema = require('../../models/eventModel')
const errorHandler = require('../../utils/errorHandler')

// MOCKS -
jest.mock('../../models/eventModel')
jest.mock('../../utils/errorHandler')

const req = {
  body: {
    eventName: 'Test Event',
    description: 'Test Description',
    venue: 'Test Venue',
    eventTime: 'Test Time',
    eventDate: 'Test Date',
    image: 'Test Image',
    guests: ['Guest 1', 'Guest 2'],
  },
  authUser: {
    id: '123456789', // Mock auth user ID
  },
}

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
}

const next = jest.fn()

describe('Create Event', () => {
  it('Should create an event and return success message', async () => {
    eventSchema.create = jest.fn().mockResolvedValue({ _id: 'eventID', eventName: 'Test Event' })

    await createEvent(req, res, next)

    expect(eventSchema.create).toHaveBeenCalledWith({
      bloodBank: '123456789',
      eventName: 'Test Event',
      description: 'Test Description',
      venue: 'Test Venue',
      eventTime: 'Test Time',
      eventDate: 'Test Date',
      image: 'Test Image',
      guests: ['Guest 1', 'Guest 2'],
    })

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Your event has been created!',
      event: { _id: 'eventID', eventName: 'Test Event' },
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('Should call next with an error if required fields are missing', async () => {
    const incompleteReq = { ...req, body: { ...req.body, eventName: null } }

    await createEvent(incompleteReq, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(errorHandler))
    expect(eventSchema.create).not.toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})

describe('Get All Events', () => {
  it('Should return all events for the authenticated user', async () => {
    const mockEvents = [
      { _id: 'eventID1', eventName: 'Event 1' },
      { _id: 'eventID2', eventName: 'Event 2' },
    ]
    eventSchema.find = jest.fn().mockResolvedValue(mockEvents)

    await getAllEvents(req, res)

    expect(eventSchema.find).toHaveBeenCalledWith({ bloodBank: '123456789' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      events: mockEvents,
    })
  })
})

describe('Get Admin Events', () => {
  it('Should return all events with blood bank names', async () => {
    const mockEvents = [
      { _id: 'eventID1', eventName: 'Event 1', bloodBank: { name: 'Blood Bank 1' } },
      { _id: 'eventID2', eventName: 'Event 2', bloodBank: { name: 'Blood Bank 2' } },
    ]
    eventSchema.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockEvents),
    })

    await getAdminEvents(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      events: mockEvents,
    })
  })
})

describe('Get User Events', () => {
  it('Should return all events for users', async () => {
    const mockEvents = [
      { _id: 'eventID1', eventName: 'Event 1' },
      { _id: 'eventID2', eventName: 'Event 2' },
    ]
    eventSchema.find = jest.fn().mockResolvedValue(mockEvents)

    await getUserEvents(req, res)

    expect(eventSchema.find).toHaveBeenCalled()

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      events: mockEvents,
    })
  })
})
