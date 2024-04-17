const mongoose = require("mongoose");
const auth = require('../middleware/auth');
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const admin = require('../middleware/admin');

const { User, validateUser } = require("../models/user");
const router = express.Router();

router.get('/me', auth , async (req, res) => {
  const user = User.findOne({username: req.user.username}).select('-password');
  res.status(200).send(user);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already exists!");

  user = new User(_.pick(req.body, ["username", "password", "phone", "names", "role"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .status(200)
    .send(_.pick(user, ["names", "username", "phone"]));
});

module.exports = router;