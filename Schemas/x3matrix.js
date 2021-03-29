const mongoose = require('mongoose');
const Schema = mongoose.Schema

const slotholderSchema = require("./slotholder");
const slottxnSchema = require("./slottxn")

const slottxn = mongoose.model("slottxn", slottxnSchema)
const slotholder = mongoose.model("slotholder", slotholderSchema);


const x3matrixSchema = new Schema({
    level: Number,
    reinvests:Number,
    genesistxn:String,
    soldspots:Number,
    slots: [{ type: Schema.Types.ObjectId, ref: slotholder }],
    gift: Number,
    loss: Number,
    owner:String,
    transactions: [{ type: Schema.Types.ObjectId, ref: slottxn }]
}, {
        timestamps: true
})


module.exports = x3matrixSchema