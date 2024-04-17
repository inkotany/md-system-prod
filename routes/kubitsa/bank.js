const auth = require('../../middleware/auth');
const agent = require('../../middleware/agent');
const mongoose = require("mongoose");
const express = require("express");
const { v4 } = require("uuid");
const { User } = require("../../models/user");
const { Student } = require("../../models/student");
const { Transaction } = require("../../models/transaction");
const Joi = require("joi");

const router = express.Router();

function validate(body) {
  let schema = Joi.object({
    code: Joi.string().required(),
    amount: Joi.number().required(),
  });

  return schema.validate(body);
}

router.get("/data", [auth, agent], async (req, res) => {
  try {
    const sum = await Student.aggregate([
      {
        $group: {
          _id: null,
          sum: { $sum: "$balance" },
        },
      },
    ]);

    const average = await Student.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: "$balance" },
        },
      },
    ]);

    const max = await Student.aggregate([
      {
        $group: {
          _id: null,
          max: { $max: "$balance" },
        },
      },
    ]);

    res
      .json({
        maximum: max[0].max,
        sum: sum[0].sum,
        average: average[0].avg,
      })
      .status(200);
  } catch (error) {
    res.status(500).send("No students found!");
  }
});

router.get("/transactions", [auth, agent], async (req, res) => {
  let transactions = await Transaction.find().sort("date_aquired");
  if (transactions.length === 0)
    return res.status(404).send("No transactions yet");
  res.send(transactions).status(200);
});

router.get("/archived", [auth, agent], async (req, res) => {
  let archived = await Transaction.find({ archived: true });
  if (archived.length === 0) return res.status(404).send("No archives");
  res.send(archived).status(200);
});

router.get("/transactions/:user", [auth, agent], async (req, res) => {
  let transactions = await Transaction.find({ agent: req.params.user });
  if (transactions.length === 0)
    return res.send("No transaction yet!").status(404);
  res.status(200).send(transactions);
});

router.get("/transactions", [auth, agent], async (req, res) => {
  let student = req.query.student;
  student = await Transaction.find({ student: { code: req.query.code } });

  if (student.length === 0) return res.send("No transaction yet!").status(404);

  res.status(200).send(student);
});

router.post("/deposit", [auth, agent], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let student = await Student.findOne({ code: req.body.code });
  if (!student) return res.status(404).send("Student not found");

  let amount = Number(req.body.amount);
  let balance = Number(student.balance);

  let newBalance = balance + amount;
  let transaction = new Transaction({
    tID: v4(),
    activity: "Kubitsa",
    amount: amount,
    student: {
      names: student.names,
      classRoom: student.classRoom,
      code: student.code,
    },
    agent: req.user.username,
  });

  await transaction.save();

  student = await Student.findOneAndUpdate(
    { code: req.body.code },
    { $set: { balance: newBalance } }
  );
  if (!student) return res.status(500).send("Igikorwa ntikibashije gukunda!");

  res
    .status(200)
    .send(
      `${student.names} abikije ${Number(req.body.amount).toLocaleString()} Rwf`
    );
});

router.post("/cashout", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let student = await Student.findOne({ code: req.body.code });
  if (!student) return res.status(404).send("Student not found");

  let balance = Number(student.balance);
  let amount = Number(req.body.amount);

  if (amount > balance)
    return res.status(200).send("Amafaranga mushyizemo ntari kuri konti!");
  let newBalance = balance - amount;

  let transaction = new Transaction({
    tID: v4(),
    activity: "Kubikuza",
    amount: amount,
    student: {
      names: student.names,
      classRoom: student.classRoom,
      code: student.code,
    },
    agent: req.user.username,
  });

  await transaction.save();

  student = await Student.findOneAndUpdate(
    { code: req.body.code },
    { $set: { balance: newBalance } }
  );

  if (!student) return res.status(500).send("Igikorwa ntikibashije gukunda!");

  res
    .status(200)
    .send(`${student.names} abikuje ${amount.toLocaleString()} Rwf`);
});

module.exports = router;