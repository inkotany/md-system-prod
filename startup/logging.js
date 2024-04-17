const winston = require("winston");
require("express-async-errors");

module.exports = function () {
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
      new winston.transports.File({ filename: "start-up.log", level: "error" }),
    ],
  });

  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    logger.error(err);
    process.exit(1);
  })
};
