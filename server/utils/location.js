// IMPORTS -
const socketIO = require('socket.io')
const receivedEvents = {
  latitude: '',
  longitude: '',
  socketId: '',
  event: '',
}

function initializeSocket(server) {
  const io = socketIO(server)

  io.on('connection', (socket) => {
    const socketId = socket.id
    socket.on('sendLocation', ({ latitude, longitude }) => {
      addEvent('sendLocation', { latitude, longitude, socketId })
    })
    socket.on('Error', (err) => {
      addEvent('Error', { err, socketId })
    })
  })
}

function addEvent(eventName, data) {
  receivedEvents.event = eventName
  receivedEvents.longitude = data.longitude
  receivedEvents.latitude = data.latitude
  receivedEvents.socketId = data.socketId
}

function getEvents() {
  return receivedEvents
}

module.exports = { initializeSocket, getEvents }
