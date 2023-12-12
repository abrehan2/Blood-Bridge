// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const bloodBankModel = require("../models/bloodBankModel");
const eventModel = require("../models/eventModel");

// CREATE AN EVENT -
exports.createEvent = catchAsyncErr(async (req, res, next) => {
  const { eventName, description, venue, eventTime, eventDate, image } =
    req.body;

  if (
    !eventName ||
    !description ||
    !venue ||
    !eventTime ||
    !eventDate ||
    !image
  ) {
    return next(new ErrorHandler("Please fill in all required fields", 400));
  }

  await eventModel.create({
    bloodBank: req.authUser.id,
    eventName,
    description,
    venue,
    eventTime,
    eventDate,
    image,
    guests: [...req.body.guests],
  });

  res.status(201).json({
    success: true,
    message: "Your event has been created!",
  });
});

// GET ALL EVENTS -
exports.getAllEvents = catchAsyncErr(async (req, res) => {
  const events = await eventModel.find({ bloodBank: req.authUser.id });

  res.status(200).json({
    success: true,
    events,
  });
});

// EDIT AN EVENT -
exports.editEvent = catchAsyncErr(async (req, res, next) => {
  const event = await eventModel.findById(req.query.id);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  const existingGuests = event.guests || [];
  const updatedGuests = [...existingGuests, ...(req.body.guests || [])];

  const updatedEvent = {
    eventName: req.body.eventName,
    description: req.body.description,
    venue: req.body.venue,
    eventTime: req.body.eventTime,
    eventDate: req.body.eventDate,
    image: req.body.image,
    guests: updatedGuests,
  };

  await event.updateOne(updatedEvent, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Your event is updated",
  });
});

// REMOVE AN EVENT -
exports.removeEvent = catchAsyncErr(async (req, res, next) => {
  const event = await eventModel.findById(req.query.id);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: "Your event is deleted",
  });
});
