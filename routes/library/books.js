const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const { Book, validateBook, validateMany } = require("../../models/book");

const auth = require('../../middleware/auth');
const librarian = require('../../middleware/librarian');

const router = express.Router();

router.get("/", [auth, librarian], async (req, res) => {
  const books = await Book.find().sort("name").select("-__v");
  res.status(200).send(books);
});

router.get("/stats", [auth, librarian], async (req, res) => {
  let total = await Book.estimatedDocumentCount();
  let issued = await Book.countDocuments({ status: "Issued" });
  let available = await Book.countDocuments({ status: "Available" });
  res.status(200).send({ total: total, issued: issued, available: available });
});

router.get("/search", [auth, librarian], async (req, res) => {
  const book = await Book.findOne({ code: req.query.code });
  if (!book)
    return res.status(404).send("The book with given code is not found!");

  res.status(200).send(book);
});

router.get("/issued", [auth, librarian], async (req, res) => {
  const books = await Book.find({ status: "Issued" }).sort("date_aquired");
  res.status(200).send(books);
});

router.get("/availability", [auth, librarian], async (req, res) => {
  const book = await Book.findOne({
    status: "Available",
    code: req.query.code,
  });
  if (!book) return res.status(404).send("Book not found or issued");

  res.status(200).send(book);
});

router.post("/", [auth, librarian], async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let check = await Book.findOne({ code: req.body.code });
  if (check)
    return res.status(400).send("Igitabo gifite iyi code gisanzwe gihari!");

  let book = new Book(
    _.pick(req.body, [
      "title",
      "code",
      "author",
      "publisher",
      "date_aquired",
      "theme",
    ])
  );
  book = await book.save();

  res.status(200).send(book);
});

router.post("/addMany", [auth, librarian], async (req, res) => {
  const { error } = validateMany(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const from = Number(req.body.from);
  const to = Number(req.body.to);
  const backCode = req.body.backCode;
  var inserted = 0;

  for (from; from <= to; from++) {
    let code = { code: from + "/" + backCode };

    let check = await Book.findOne({ code: code });
    if (check) continue;

    let book = new Book({ ...req.body, ...code });
    await book.save();
    inserted++;
  }

  res.status(200).send(`${inserted} out of ${to} Books added successfully`);
});

router.put("/:code", [auth, librarian], async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let book = await Book.findOneAndUpdate(
    { code: req.params.code },
    _.pick(req.body, [
      "title",
      "code",
      "author",
      "publisher",
      "date_aquired",
      "theme",
    ]),
    { new: true }
  );

  if (!book) return res.status(404).send("Book is not found!");
  res.status(200).send(book);
});

router.delete("/:code", [auth, librarian], async (req, res) => {
  const book = Book.findOneAndDelete({ code: req.params.code });
  if (!book) return res.status(404).send("Book with given code not found!");

  res.status(200).send(book);
});

module.exports = router;