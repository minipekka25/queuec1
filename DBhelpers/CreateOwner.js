const dbconnect = require("../dbconnect");
const userSchema = require("../Schemas/user");
const x3matrixSchema = require("../Schemas/x3matrix");
const x6matrixSchema = require("../Schemas/x6matrix");
const matrixstatSchema = require("../Schemas/matrixstat");
const slottxnSchema = require("../Schemas/slottxn");

let mxdb = dbconnect.getDatabaseConnection("Matrix");

const user = mxdb.model("user", userSchema);
const x3matrix = mxdb.model("x3matrix", x3matrixSchema);
const x6matrix = mxdb.model("x6matrix", x6matrixSchema);
const matrixStat = mxdb.model("Matrixstat", matrixstatSchema);
const slottxn = mxdb.model("slottxn", slottxnSchema);

const price = [0.025, 0.05, 0.075, 0.1, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];



exports.CreateOwner = async (data) =>{
    let createdtxn = []
    let createdx3 = [];
    let createdx6 = [];
    for (i = 1; i <= 10; i++) {
        let newx3matrix = new x3matrix({
            level: i,
            reinvests: 0,
            genesistxn: data.txnhash,
            soldspots: 0,
            slots: [],
            gift: 0,
            loss: 0,
            transactions: [],
            owner: data.address
        });

        let newx6matrix = new x6matrix({
            level: i,
            reinvests: 0,
            soldspots: 0,
            genesistxn: data.txnhash,
            slots: [],
            gift: 0,
            loss: 0,
            slippageup: 0,
            slippagedown: 0,
            slippagepartner: 0,
            transactions: [],
            owner: data.address
        });

        let newSlotTxnx3 = new slottxn({
            transactionId: data.txnHash,
            useraddress: null,
            referreraddress: data.address,
            referrerid: null,
            value: price[i - 1],
            level: i,
            reinvest: 0,
            place: 0,
            matrix: '1',
            txntype: 'upgrade',
        });

        let newSlotTxnx6 = new slottxn({
            transactionId: data.txnHash,
            useraddress: null,
            referreraddress: data.address,
            referrerid: null,
            value: price[i - 1],
            level: i,
            reinvest: 0,
            place: 0,
            matrix: '2',
            txntype: 'upgrade',
        });


       

        try {
            let created3 = await newx3matrix.save();
            let created6 = await newx6matrix.save();
            if(i>1){
                let upgtxnx3 = await newSlotTxnx3.save();
                let upgtxnx6 = await newSlotTxnx6.save();
                createdtxn.push(upgtxnx3);
                createdtxn.push(upgtxnx6);
            }
        
         
            createdx3.push(created3);
            createdx6.push(created6);
           
        } catch (e) {
            console.log(e);
        }
    }

    let newSlotTxn = new slottxn({
        transactionId: data.txnHash,
        useraddress: 'null',
        referreraddress: data.address,
        referrerid: 1,
        value: 0.050,
        level: 0,
        reinvest: 0,
        place: 0,
        matrix: 0,
        txntype: 'registered',
    });

    try {

        let regtxn = await newSlotTxn.save();
        createdtxn.push(regtxn)
        let newUser = new user({
            id: 1,
            address: data.address,
            referrer: null,
            partnersCount: 0,
            beneficiery: data.address,
            x3active: [true, true, true, true, true, true, true, true, true, true],
            x6active: [true, true, true, true, true, true, true, true, true, true],
            x3count:10,
            x6count:10,
            partners: [],
            x3Matrix: createdx3,
            x6Matrix: createdx6,
            genesistxn:data.txnhash,
            earningsTotal: 0,
            earnings3x: 0,
            earnings6x: 0,
            totalgift:0,
            totalloss:0,
            gift: 0,
            loss: 0,
            overtook: false,
            overtaken: [],
            transactions: createdtxn,
        });


        try {
            await newUser.save();
        } catch (e) {
            console.log(e);
        }
    } catch (e) {
        console.log(e);
    }
}