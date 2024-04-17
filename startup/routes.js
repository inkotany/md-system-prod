const express = require('express');
const auth = require("../routes/auth");
const users = require("../routes/users");
const status = require('../routes/status');
const bookRoute = require("../routes/library/books");
const themeRoute = require("../routes/library/themes");
const studentRoute = require("../routes/students");
const passwords = require("../routes/passwords");
const bank = require("../routes/kubitsa/bank");
const dorm = require("../routes/dorm/dorm");
const library = require("../routes/library/activities");
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/books", bookRoute);
  app.use("/api/themes", themeRoute);
  app.use("/api/students", studentRoute);
  app.use("/api/passwords", passwords);
  app.use("/api/kubitsa", bank);
  app.use("/api/dorm", dorm);
  app.use("/api/library", library);
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/status", status);
  app.use(error);
};
