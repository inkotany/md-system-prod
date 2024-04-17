const mongoose = require('mongoose');
const Joi = require('joi');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    date_aquired: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Available', 'Issued', 'Missing'],
        default: 'Available'
    },
    theme: {
        type: String
    },
    isTorn: {
        type: Boolean
    },
    archived: {
        type: Boolean
    }
});

const Book = mongoose.model('Book', bookSchema);

function validateBook(book) {
    let schema = Joi.object({
        title: Joi.string().required().min(3),
        code: Joi.string().required(),
        author: Joi.string().required().min(3),
        publisher: Joi.string().required().min(3),
        theme: Joi.string().min(2).required(),
        date_aquired: Joi.required()
    });
    return schema.validate(book);
}

function validateMany(book) {
    let schema = Joi.object({
        title: Joi.string().required().min(3),
        author: Joi.string().required().min(3),
        publisher: Joi.string().required().min(3),
        theme: Joi.string().min(2).required(),
        date_aquired: Joi.required(),
        from: Joi.number().required(),
        to: Joi.number().required(),
        backCode: Joi.string().required()
    })
}

module.exports = { Book, validateBook, validateMany };