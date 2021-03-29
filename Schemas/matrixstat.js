const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = require("./user")

const user = mongoose.models.user || mongoose.model('user', userSchema);

const matrixstatSchema = new Schema({
    ide: String,
    totalParticipants: Number,
    totalCapital: Number,
    total3xCapital: Number,
    total6xCapital: Number,
    Usersjoined: Number,
    ethcost: Number,
    ethchange: Number,
    contractAddress: String,
    topUsers: [{ type: Schema.Types.ObjectId, ref: user }],
    newJoinees: [{ type: Schema.Types.ObjectId, ref: user }]
}, {
        timestamps: true
})


module.exports =matrixstatSchema