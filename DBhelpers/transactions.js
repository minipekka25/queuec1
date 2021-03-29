const dbconnect = require("../dbconnect");
const TransactionSchema = require("../Schemas/transactions");
const TxnlogSchema = require("../Schemas/txnlog");

let mxdb = dbconnect.getDatabaseConnection("Matrix");

const Transaction = mxdb.model("Transaction", TransactionSchema);
const Txnlog = mxdb.model("Txnlog", TxnlogSchema);

exports.createTransaction = async (event) => {
  let newTransaction = new Transaction({
    transactionId: event.transactionHash,
    stage: "processed",
    eventName: event.event,
    dataLog:  event.returnValues
  });

  try {
    await newTransaction.save();
  } catch (e) {
    console.error(e);
  }
};

exports.declinedTransaction = async (transactionId,eventname) => {
  try {
    let foundTxn = await Transaction.findOne({
      transactionId: transactionId,
      eventName: eventname
    });

    foundTxn.stage = "declined";
    foundTxn.save();
  } catch (e) {
    console.error(e);
  }
};

exports.newTxnlog = async(transactionId) =>{
    let findTxn = await Txnlog.findOne({transactionId:transactionId})
    if(findTxn){
        findTxn.status = 'pending'
        try {
            await findTxn.save();
        } catch (e) {
            console.error(e);
        }
    }else{
        let newTxnlog = new Txnlog({
            transactionId: transactionId,
            status: 'pending'
        });
        try {
            await newTxnlog.save();
        } catch (e) {
            console.error(e);
        }
    }
}

exports.errTxnlog = async (transactionId) => {
    let findTxn = await Txnlog.findOne({ transactionId: transactionId })
    if (findTxn) {
        findTxn.status = 'error'
        try {
            await findTxn.save();
        } catch (e) {
            console.error(e);
        }
    } else {
        let newTxnlog = new Txnlog({
            transactionId: transactionId,
            status: 'error'
        });
        try {
            await newTxnlog.save();
        } catch (e) {
            console.error(e);
        }
    }
}