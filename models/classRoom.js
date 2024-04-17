const mongoose = require('mongoose');
const Joi = require('joi');

const classRoomSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true
    }
});

const ClassRoom = mongoose.model('ClassRoom', classRoomSchema);

function validateClassRoom(classRoom) {
    let schema = Joi.object({
        class: Joi.string().required(),
    });
    return schema.validate(classRoom);
}

module.exports = { ClassRoom, validateClassRoom };