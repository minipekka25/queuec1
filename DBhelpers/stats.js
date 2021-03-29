const dbconnect = require("../dbconnect");
const matrixstatSchema = require("../Schemas/matrixstat");
const userstatSchema = require("../Schemas/userstat");

let mxdb = dbconnect.getDatabaseConnection("Matrix");

const matrixStat = mxdb.model("Matrixstat",matrixstatSchema);
const userStat = mxdb.model("Userstat", userstatSchema);

exports.createUserstat = async (transactionId,address) => {
    let newUserstat = new userStat({
        address:address,
        transactionId:transactionId,
        status:'pending'
    });

    try {
        await newUserstat.save();
    } catch (e) {
        console.error(e);
    }
};

exports.removeUserstat = async (transactionId) =>{
    let findUserstat = await matrixStat.findOne({ transactionId: transactionId })
    if(findUserstat){
        findUserstat.stage = 'declined'
        try {
            await findUserstat.save();
        } catch (e) {
            console.error(e);
        }
    }
}

exports.createMatrixstat = async (newuser, value, matrix) => {
    let findMatrixstat = await matrixStat.findOne({ ide: 'genesis' })
    if (findMatrixstat) {
        if(newuser){
         await matrixStat.findOneAndUpdate({ ide: 'genesis' }, { $inc: { 'totalParticipants': 1 } }).exec()
        } 
        if (matrix === 1){
            await matrixStat.findOneAndUpdate({ ide: 'genesis' }, { $inc: { 'total3xCapital': value, 'totalCapital': value } }).exec((e,r)=> {if(e){console.log(e)}})
        } else if (matrix === 2){
            await matrixStat.findOneAndUpdate({ ide: 'genesis' }, { $inc: { 'total6xCapital': value, 'totalCapital': value } }).exec((e, r) => {if(e){ console.log(e)}})
        }

    } else {
        let newMatrixstat = new matrixStat({
            ide:'genesis',
            totalParticipants:1,
            totalCapital:21.500,
            total3xCapital:10.750,
            total6xCapital:10.750,
            topUsers: [],
            newJoinees: [],
            Usersjoined: 0,
            ethcost: 0,
            ethchange: 0,
            contractAddress: '',
        });
        try {
            await newMatrixstat.save();
        } catch (e) {
            console.error(e);
        }
    }
};

exports.removeMatrixstat = async (newuser, value, matrix) =>{
    if (newuser) {
        await matrixStat.findOneAndUpdate({ ide: 'genesis' }, { $inc: { 'totalParticipants': -1 } }).exec()
    }
    if (matrix === 1) {
        await matrixStat.findOneAndUpdate({ ide: 'genesis' }, { $inc: { 'total3xCapital': -value, 'totalCapital': -value } }).exec((e, r) => { if (e) { console.log(e) } })
    } else if (matrix === 2) {
        await matrixStat.findOneAndUpdate({ ide: 'genesis' }, { $inc: { 'total6xCapital': -value, 'totalCapital': -value } }).exec((e, r) => { if (e) { console.log(e) } })
    }
    

}

