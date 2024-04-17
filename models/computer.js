const mongoose = require('mongoose');
const Joi = require('joi');

const computerSchema = new mongoose.Schema({
    cId: {
        type: String,
        unique: true,
        required: true
    },
    issuer: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Laptop', 'Desktop']
    },
    serial: {
        type: String,
        default: 'None'
    },
    lab: {
        type: String,
        required: true
    }
});

const Computer = mongoose.model('Computer', computerSchema);

function validateComputer(computer) {
    let schema = Joi.object({
        cId: Joi.string().required(),
        issuer: Joi.string().required(),
        type: Joi.string().required(),
        serial: Joi.string().required(),
        lab: Joi.string().required()
    });
    return schema.validate(computer);
}

module.exports = { Computer, validateComputer };