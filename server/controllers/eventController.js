// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("../middlewares/catchAsyncErr");
const userModel = require("../models/userModel");
const eventModel = require("../models/eventModel");
const sendEmail = require("../utils/email");

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

  const event = await eventModel.create({
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
    event,
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

  const updatedGuests = [...(req.body.guests || [])];

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

// NOTIFY USERS -
exports.notifyUsers = catchAsyncErr(async (req, res, next) => {
  const users = await userModel.find();
  const event = await eventModel.findOne(req.body.eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  if (!users) {
    return next(new ErrorHandler("Users not found", 404));
  }

  const filteredUsers = users.filter((user) => user.role !== "admin");

  await Promise.all(
    filteredUsers.map(async (user) => {
      const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Blood Bridge: Blood Request Update</title>
  </head>
  <body>

    <img src=${event?.image} alt=${event?.eventName} style="width: 100%"/>
    <p>Dear ${user?.firstName} ${user?.lastName},</p>

    <p>We'd like to inform you that ${event?.bloodBank?.name} is hosting a ${
        event?.eventName
      }!</p>
    <p>Please visit us on <b>${
      event?.eventDate.toISOString().split("T")[0]
    }</b> at <b>${event?.eventTime}</b>.</p>
    <p><b>Location:</b> ${event?.venue}.</p>

    <p>Best,</p>
    <p><b>${event?.bloodBank?.name}</b></p>
  </body>
  </html>`;

      await sendEmail({
        email: user?.email,
        subject: `Blood Bridge Event: ${event?.eventName}`,
        message: html,
      });
    })
  );

  res.status(200).json({
    success: true,
    message: "Users have been notified",
  });
});

// GET ALL EVENTS FOR ADMIN -
exports.getAdminEvents = catchAsyncErr(async (req, res, next) => {
  const events = await eventModel.find().populate("bloodBank", "name");

  res.status(200).json({
    success: true,
    events, 
  });
});

// GET ALL EVENTS FOR USERS -
exports.getUserEvents = catchAsyncErr(async (req, res, next) => {
  const events = await eventModel.find();

  res.status(200).json({
    success: true,
    events,
  });
});