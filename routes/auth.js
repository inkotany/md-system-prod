const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Izina mushyizemo ntabwo ari ryo!");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Umubare w' ibanga mwanditse si wo!");

  const token = user.generateAuthToken();
  res.send(token);
});

function validateUser(user) {
  let schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
}

module.exports = router;
