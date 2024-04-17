const Joi = require('joi');
const { v4 } = require('uuid');
const mongoose = require('mongoose');
const express = require('express');
const { Book } = require('../../models/book');
const { Student } = require('../../models/student');
const { Activity } = require('../../models/activity');

const auth = require('../../middleware/auth');
const librarian = require('../../middleware/librarian');

const router = express.Router();

router.post('/issue', [auth, librarian], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let book = await Book.findOne({code: req.body.book, status: 'Available'});
    if (!book) return res.status(404).send('Book not found or issued!');

    let student = await Student.findOne({code: req.body.student});
    if (!student) return res.status(404).send('Student not found!');

    let activity = new Activity({
        aID: v4(),
        activity: 'Issue',
        student: {
            names: student.names,
            classRoom: student.classRoom,
            code: student.code,
            gender: student.gender
        },
        book: {
            title: book.title,
            code: book.code,
            theme: book.theme
        }
    });

    book = await Book.findOneAndUpdate({code: req.body.code}, { $set: {status: 'Issued'}});
    if (!book) return res.status(500).send('Operation failed!');

    await activity.save();
    res.status(200).send(`${student.names} atijwe igitabo ${book.title}`);
});

router.post('/return', [auth, librarian], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let book = await Book.findOne({code: req.body.book, status: 'Issued'});
    if (!book) return res.status(400).send('This Book is available!');

    let student = await Student.findOne({code: req.body.student});
    if (!student) return res.status(404).send('Student not found!');

    let activity = new Activity({
        aID: v4(),
        activity: 'Return',
        student: {
            names: student.names,
            classRoom: student.classRoom,
            code: student.code,
            gender: student.gender
        },
        book: {
            title: book.title,
            code: book.code,
            theme: book.theme
        }
    });

    book = await Book.findOneAndUpdate({code: req.body.code}, { $set: {status: 'Available'}});
    if (!book) return res.status(500).send('Operation failed!');

    await activity.save();
    res.status(200).send(`${student.names} atiruye igitabo ${book.title}`);
})

function validate(body) {
    let schema = Joi.object({
        book: Joi.string().required(),
        student: Joi.string().required()
    });
    return schema.validate(body);
}

module.exports = router;