// IMPORTS -
const winston = require('winston')
const path = require('path');

const logger = (level, m) => {
  return winston
    .createLogger({
      level: level,
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', 'error.log') })],
    })
    .log({
      level: level,
      message: m,
    })
}

module.exports = logger
