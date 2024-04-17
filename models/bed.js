const mongoose = require('mongoose');
const Joi = require('joi');

const bedSchema = new mongoose.Schema({
    bID: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
});

const Bed = mongoose.model('Bed', bedSchema);

function validateBed(bed) {
    let schema = Joi.object({
        bID: Joi.string().required(),
        type: Joi.number().required()
    });
    return schema.validate(bed);
}

module.exports = { Bed, validateBed };