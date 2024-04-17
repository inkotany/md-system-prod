const mongoose = require('mongoose');
const Joi = require('joi');

const themeSchema = new mongoose.Schema({
    theme: {
        type: String,
        required: true,
        unique: true
    }
});

const Theme = mongoose.model('Theme', themeSchema);

function validateTheme(theme) {
    let schema = Joi.object({
        theme: Joi.string().required().min(3)
    });
    return schema.validate(theme);
}

module.exports = { Theme, validateTheme };