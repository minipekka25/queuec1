const mongoose = require('mongoose');
const Schema = mongoose.Schema

const slottxnSchema = require("./slottxn");
const slottxn = mongoose.model("slottxn", slottxnSchema);

const slotholderSchema = new Schema({
    user: String,
    level: String,
    matrix: String,
    reinvest: String,
    slotholder: [{ type: Schema.Types.ObjectId, ref: slottxn }]
}, {
        timestamps: true
})


module.exports = slotholderSchema