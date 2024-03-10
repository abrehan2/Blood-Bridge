// IMPORTS -
const winston = require('winston')

const logger = (level, m) => {
  return winston
    .createLogger({
      level: level,
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [new winston.transports.File({ filename: './logs/error.log' })],
    })
    .log({
      level: level,
      message: m,
    })
}

module.exports = logger
