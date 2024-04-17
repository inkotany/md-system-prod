const mongoose = require('mongoose');
const Joi = require('joi');

const transactionSchema = new mongoose.Schema({
    tID: {
        type: String,
        required: true
    },
    activity: {
        type: String,
        enum: ['Kubitsa', 'Kubikuza'],
        required: true
    },
    student: {
        names: {type: String, required: true},
        classRoom: {type: String, required: true},
        code: {type: String, required: true}
    },
    agent: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    doneOn: {
        type: Date,
        default: Date.now
    },
    archived: {
        type: Boolean
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

function validateTransaction(transaction) {
    let schema = Joi.object({
        activity: Joi.required(),
        doneOn: Joi.required(),
        agent: Joi.required()
    });
    return schema.validate(transaction);
}

module.exports = { Transaction , validateTransaction };