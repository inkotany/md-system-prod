const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "system.log", level: "error" }),
  ],
});

module.exports = function (err, req, res, next) {
  logger.error(err.message);
  res.status(500).send("Internal Server Error");
};
