const mongoose = require("mongoose");
const Joi = require("joi");

const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  names: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { username: this.username, isAdmin: this.isAdmin, role: this.role },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  let schema = Joi.object({
    username: Joi.string().min(3).required(),
    names: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
  });
  return schema.validate(user);
}

module.exports = { User, validateUser };