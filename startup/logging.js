const winston = require('winston');
require('express-async-errors');

module.exports = function () {
  winston.add(new winston.transports.File(), { filename: "logfile.log" });

  process.on("uncaughtException", (ex) => {
    console.log("UNCAUGHT ERROR");
    winston.error(ex.message, ex);
  });

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
