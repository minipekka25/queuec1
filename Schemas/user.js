const mongoose = require('mongoose');
const Schema = mongoose.Schema


const x3matrixSchema = require("./x3matrix");
const x6matrixSchema = require("./x6matrix");
const slottxnSchema = require("./slottxn");
const transactionSchema = require("./transactions");

const x3matrix = mongoose.model("x3matrix", x3matrixSchema);
const x6matrix = mongoose.model("x6matrix", x6matrixSchema);
const slottxn = mongoose.model("slottxn", slottxnSchema);
const transactions = mongoose.model("transaction", transactionSchema);


const userSchema = new Schema({
    id:Number,
    address:String,
    referrer: { type: Schema.Types.ObjectId, ref: 'user' },
    partnersCount:Number,
    beneficiery:String,
    x3active:Array,
    x6active:Array,
    x3count: Number,
    x6count: Number,
    partners: [{ type: Schema.Types.ObjectId, ref: 'user'}],
    x3Matrix:[{ type: Schema.Types.ObjectId, ref: x3matrix}],
    x6Matrix: [{ type: Schema.Types.ObjectId, ref: x6matrix}],
    earningsTotal: Number,
    genesistxn: String,
    earnings3x:Number,
    earnings6x:Number,
    totalgift:Number,
    totalloss:Number,
    overtook:Boolean,
    totalgift:Number,
    totalloss:Number,
    overtaken:[{ type: Schema.Types.ObjectId, ref: transactions}],
    transactions: [{ type: Schema.Types.ObjectId, ref: slottxn }] 
}, {
        timestamps: true
})




module.exports = userSchema