const mongoose = require('mongoose');

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/materDei")
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => {throw err})
};