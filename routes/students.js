const auth = require('../middleware/auth');
const mongoose = require("mongoose");
const express = require("express");
const { ClassRoom } = require("../models/classRoom");
const {
  Student,
  validateStudent,
  generateStudentCode,
  generateUniqueStudentCode,
} = require("../models/student");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const students = await Student.find().sort("classRoom");
  res.send(students);
});

router.get("/stats", auth, async (req, res) => {
  let total = await Student.estimatedDocumentCount();
  res.status(200).json({ total: total });
});

router.get("/:code", auth, async (req, res) => {
  const student = await Student.findOne({ code: req.params.code });
  if (!student) return res.status(404).send("Student not found!");

  res.status(200).send(student);
});

router.get("/byClass/:class", auth, async (req, res) => {
  let students = await Student.find({ classRoom: req.params.class }).sort(
    "names"
  );
  if (students.length == 0)
    return res
      .status(404)
      .send("Nta munyeshuri dufite muri " + req.params.class);

  res.status(200).send(students);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateStudent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let checkClass = await ClassRoom.findOne({ class: req.body.classRoom });
  if (!checkClass)
    return res
      .status(404)
      .send(
        `Class mwanditsemo: ${req.body.classRoom} ntiba muri system, mubanze muyongeremo.`
      );

  const code = await generateUniqueStudentCode();

  let student = new Student({
    names: req.body.names,
    code: code,
    combination: req.body.combination,
    gender: req.body.gender,
    classRoom: req.body.classRoom,
  });

  student = await student.save();

  res.status(200).send(student);
});

router.put("/:code", auth, async (req, res) => {
  const { error } = validateStudent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let student = await Student.findOneAndUpdate(
    { code: req.params.code },
    {
      names: req.body.names,
      combination: req.body.combination,
      gender: req.body.gender,
      classRoom: req.body.classRoom,
    },
    { new: true }
  );

  if (!student)
    return res
      .status(404)
      .send(`Umunyeshuri ufite code: ${req.params.code} ntabonetse`);
  res.status(200).send("Update Success!");
});

router.delete("/:code", auth, async (req, res) => {
  const student = Student.findOneAndDelete({ code: req.params.code });
  if (!student) return res.status(404).send("Student not found");
  res.status(200).send(student);
});

module.exports = router;