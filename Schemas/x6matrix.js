const mongoose = require('mongoose');
const Schema = mongoose.Schema

const slotholderSchema = require("./slotholder");
const slottxnSchema = require("./slottxn")

const slottxn = mongoose.model("slottxn", slottxnSchema)
const slotholder = mongoose.model("slotholder", slotholderSchema);

const x6matrixSchema = new Schema({
    level: Number,
    reinvests: Number,
    soldspots: Number,
    genesistxn: String,
    slots: [{ type: Schema.Types.ObjectId, ref: slotholder }],
    gift: Number,
    loss: Number,
    slippageup:Number,
    slippagedown:Number,
    slippagepartner:Number,
    owner:String,
    transactions: [{ type: Schema.Types.ObjectId, ref: slottxn }]
}, {
        timestamps: true
})


module.exports = x6matrixSchema