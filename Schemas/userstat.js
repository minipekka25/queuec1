const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userstatSchema = new Schema({
    address: String,
    transactionId: String,
    status:String 
}, {
        timestamps: true
})

module.exports = userstatSchema