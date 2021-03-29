const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = require("./user");



const slottxnSchema = new Schema({
    transactionId: String,
    useraddress: String,
    referreraddress: String,
    referrerid:Number,
    value:Number,
    level:Number,
    reinvest:Number,
    place:Number,
    matrix:String,
    txntype:String
}, {
        timestamps: true
})


module.exports = slottxnSchema