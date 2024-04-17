const mongoose = require('mongoose');
const Joi = require('joi');

const dormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    }
});

const Dorm = mongoose.model('Dorm', dormSchema);

function validateDorm(dorm) {
    let schema = Joi.object({
        name: Joi.string().required(),
        abbr: Joi.string().required().max(3)
    });
    return schema.validate(dorm);
}

module.exports = { validateDorm, Dorm };