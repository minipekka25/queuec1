const mongoose = require('mongoose');
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    transactionId: String,
    stage: String,
    eventName: String,
    dataLog: Object
}, {
        timestamps: true
})


module.exports = transactionSchema