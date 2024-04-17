const mongoose = require('mongoose');
const Joi = require('joi');

const activitySchema = new mongoose.Schema({
    aID: {
        type: String,
        required: true
    },
    activity: {
        type: String,
        enum: ['Issue', 'Return'],
        required: true
    },
    student: {
        names: {type: String, required: true},
        classRoom: {type: String, required: true},
        gender: {type: String, enum: ['F', 'M']},
        code: {type: String, required: true}
    },
    book: {
        title: {type: String, required: true},
        code: {type: String, required: true},
        theme: {type: String, required: true}
    },
    doneOn: {
        type: Date,
        default: Date.now
    }
});

const Activity = mongoose.model('Activity', activitySchema);


module.exports = {  Activity };