const mongoose = require('mongoose');
const Schema = mongoose.Schema

const txnlogSchema = new Schema({
    transactionId: String,
    status: String
}, {
        timestamps: true
})


module.exports = txnlogSchema