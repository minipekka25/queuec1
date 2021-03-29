const Web3 = require('web3');
const queueConfig = require('./queue')
const bodyParser = require("body-parser");
const express = require('express')
const app = express()
const port = 3003
const contract = require('./contract-config')
const Queue = require('bee-queue');

const Transaction = require('./DBhelpers/transactions')
const Stats = require('./DBhelpers/stats')
const CreateOwner = require('./DBhelpers/CreateOwner').CreateOwner





const price = [0.025,0.050,0.075,0.100,0.500,1.000,1.500,2.000,2.500,3.000]

const new_Reg_Upgrade = new Queue('new_Reg_Upgrade', queueConfig);
const new_place_reinvest = new Queue('new_place_reinvest', queueConfig);
const new_gft_loss_benechng = new Queue('new_gft_loss_benechng', queueConfig);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

   
         

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/seed/:address/:txnhash', async (req, res) => {

    
    CreateOwner({address:req.params.address,txnhash:req.params.txnhash})
    Stats.createUserstat(req.params.address, req.params.txnhash)
    Stats.createMatrixstat()
    res.send('Seed Req Sent')
})

app.get('/dummy', async (req, res) => {

    let event = {
        returnValues: { "0": "0x415Ba920f23Dd8dA4f9BF51EABf3564BA0D78eD1", "1": "0xCF5E2FBA44FdcF95499924181c208C7bd083bac7", "2": "7", "3": "1", "user": "0x415Ba920f23Dd8dA4f9BF51EABf3564BA0D78eD1", "referrer": "0xCF5E2FBA44FdcF95499924181c208C7bd083bac7", "userId": "7", "referrerId": "1" },
        transactionHash: '0xb25149691e63b60d098843cb0a6efe79f965ec4e90155b2f60f3238e4350982d',
        event:'Registration'
    }

    const createdJob = new_Reg_Upgrade.createJob({ type: "RevokeRegistration", event: event })
    createdJob.timeout(3000).retries(5).save();
    Transaction.declinedTransaction(event.transactionHash, event.event)
    Transaction.errTxnlog(event.transactionHash)
    Stats.removeUserstat(event.transactionHash)
    Stats.removeMatrixstat(true, price[0], 1)
    Stats.removeMatrixstat(false, price[0], 2)

    res.send('dummy Req Sent')
})

app.get('/hi', async (req, res) => {
    res.send('hi')
})

app.post('/post/test', function (req, res) {
    console.log(req.body.test)
})

app.post('/post/events', function (req, res) {
    console.log(req.body.events)
    let reg = req.body.events.Registration
    let upg = req.body.events.Upgrade
    let newp = req.body.events.NewUserPlace
    let rein = req.body.events.Reinvest
    let loss = req.body.events.MissedEthReceive
    let gift = req.body.events.SentExtraEthDividends
    let ben = req.body.events.BeneficieryChanged

    if(reg){
        Registration(reg)
    }
    if(upg){
        Upgrade(upg)
    }
    if(newp){
        if(Array.isArray(newp)){
            newp.map(i=> NewUserPlace(i))
        }
       else{
           NewUserPlace(newp)
       } 
    }
    if(rein){
        if (Array.isArray(rein)) {
            rein.map(i => Reinvest(i))
        }
        else {
            Reinvest(rein)
        } 
    }
    if(loss){
        if (Array.isArray(loss)) {
            loss.map(i => MissedEthReceive(i))
        }
        else {
            MissedEthReceive(loss)
        } 
    }
    if(gift){
        if (Array.isArray(gift)) {
            gift.map(i => SentExtraEthDividends(i))
        }
        else {
            SentExtraEthDividends(gift)
        } 
    }
    if(ben){
        BeneficieryChanged(ben)
        console.log(ben)
    }


    res.json({resp:"yes"});
});



// event listener

//queues


let Registration = (event) => {
    console.log('new Register event');
    Transaction.newTxnlog(event.transactionHash)
    Transaction.createTransaction(event)
    Stats.createUserstat(event.transactionHash, event.returnValues.user)
    Stats.createMatrixstat(true, price[0], 1)
    Stats.createMatrixstat(false, price[0], 2)
    const createdJob = new_Reg_Upgrade.createJob({ type: "NewRegistration", event: event })
    createdJob.timeout(3000).retries(5).save();
    createdJob.on('succeeded', (result) => {
        console.log(`Received result for job ${createdJob.id}`);
    });
}

let Upgrade = (event) => {
    console.log('new Upgrade Event');
    Transaction.newTxnlog(event.transactionHash)
    Transaction.createTransaction(event)
    Stats.createMatrixstat(false, price[Number(event.returnValues.level) - 1], Number(event.returnValues.matrix))
    const createdJob = new_Reg_Upgrade.createJob({ type: "NewUpgrade", event: event })
    createdJob.save();
    createdJob.on('succeeded', (result) => {
        console.log(`Received result for job ${createdJob.id}`);
    });
}

let NewUserPlace = (event) =>{
    console.log('new Place Event');
        Transaction.createTransaction(event)
        const createdJob = new_place_reinvest.createJob({ type: "NewPlace", event: event })
        createdJob.save();
        
}

let Reinvest = (event) =>{
    console.log('new Reinvest Event');
    Transaction.createTransaction(event)
    const createdJob = new_place_reinvest.createJob({ type: "NewReinvest", event: event })
    createdJob.save();
}


let MissedEthReceive =(event) =>{
    console.log('new MissedEthReceive Event');
    Transaction.createTransaction(event)
    const createdJob = new_gft_loss_benechng.createJob({ type: "MissedEthReceive", event: event })
    createdJob.save();
}
let SentExtraEthDividends = (event) =>{
    console.log('new SentExtraEthDividends Event');
    Transaction.createTransaction(event)
    const createdJob = new_gft_loss_benechng.createJob({ type: "SentExtraEthDividends", event: event })
    createdJob.save();
}
let BeneficieryChanged = (event) =>{
    console.log('new BeneficieryChanged Event');
    Transaction.createTransaction(event)
    const createdJob = new_gft_loss_benechng.createJob({ type: "BeneficieryChanged", event: event })
    createdJob.save();
}


// contract.events.Registration()
    
//     .on('data', function (event) {
//         console.log('new Register event');
//         Transaction.newTxnlog(event.transactionHash)
//         Transaction.createTransaction(event)
//         Stats.createUserstat(event.transactionHash, event.returnValues.user)
//         Stats.createMatrixstat(true,price[0],1)
//         Stats.createMatrixstat(false, price[0], 2)
//         const createdJob = new_Reg_Upgrade.createJob({type:"NewRegistration" , event: event })
//         createdJob.timeout(3000).retries(5).save();
//         createdJob.on('succeeded', (result) => {
//             console.log(`Received result for job ${createdJob.id}`);
//         });
//     })
//     .on('changed', function (event) {
        
//         const createdJob = RemoveRegistration.createJob({ type: "RevokeRegistration", event: event})
//         createdJob.timeout(3000).retries(5).save();
//         Transaction.declinedTransaction(event.transactionHash, event.event)
//         Transaction.errTxnlog(event.transactionHash)
//         Stats.removeUserstat(event.transactionHash)
//         Stats.removeMatrixstat(true, price[0], 1)
//         Stats.removeMatrixstat(false, price[0], 2)
//     })
//     .on('error', function (error, receipt) { 
//         console.log(error)
//         if(receipt){
            
//             const createdJob = RemoveRegistration.createJob({ id: receipt.returnValues.userId })
//             createdJob.timeout(3000).retries(5).save();
//             Transaction.declinedTransaction(receipt.transactionHash, receipt.event)
//             Transaction.errTxnlog(receipt.transactionHash)
//             Stats.removeUserstat(receipt.transactionHash)
//             Stats.removeMatrixstat(true, price[0], 1)
//             Stats.removeMatrixstat(false, price[0], 2)
//         }
// })


// contract.events.Upgrade()

//     .on('data', function (event) {
//         console.log('new Upgrade Event');
//         Transaction.newTxnlog(event.transactionHash)
//         Transaction.createTransaction(event)
//         Stats.createMatrixstat(false, price[Number(event.returnValues.level) - 1], Number(event.returnValues.matrix))
//         const createdJob = new_Reg_Upgrade.createJob({ type: "NewUpgrade", event: event })
//         createdJob.timeout(3000).retries(0).save();
//         createdJob.on('succeeded', (result) => {
//             console.log(`Received result for job ${createdJob.id}`);
//         });
// })
//     .on('changed', function (event) {
//         Transaction.declinedTransaction(event.transactionHash,event.event)
//         Transaction.errTxnlog(event.transactionHash)
//         Stats.removeMatrixstat(false, price[event.returnValues.level], event.returnValues.matrix)   
//     })
//     .on('error', function (error, receipt) { 
//         console.log(error)
//         if (receipt) {
//             Transaction.errTxnlog(receipt.transactionHash)
//             Stats.removeMatrixstat(false, price[receipt.returnValues.level], receipt.returnValues.matrix)
//         }
//     })


// contract.events.NewUserPlace()

//     .on('data', function (event) {
//         console.log('new Place Event');
//         Transaction.createTransaction(event)
//         const createdJob = new_place_reinvest.createJob({ type: "NewPlace", event: event })
//         createdJob.timeout(3000).retries(0).save();
//     })
//     .on('changed', function (event) {
//         Transaction.declinedTransaction(event.transactionHash, event.event)
//         Transaction.errTxnlog(event.transactionHash)
      
//     })
//     .on('error', function (error, receipt) {
//         console.log(error)
//         if (receipt) {
//             Transaction.errTxnlog(receipt.transactionHash)
//         }
//     })

   
// contract.events.Reinvest()

//     .on('data', function (event) {
//         console.log('new Reinvest Event');
//         Transaction.createTransaction(event)
//         const createdJob = new_place_reinvest.createJob({ type: "NewReinvest", event: event })
//         createdJob.timeout(3000).retries(0).save();
//     })
//     .on('changed', function (event) {
//         Transaction.declinedTransaction(event.transactionHash, event.event)
//         Transaction.errTxnlog(event.transactionHash)

//     })
//     .on('error', function (error, receipt) {
//         console.log(error)
//         if (receipt) {
//             Transaction.errTxnlog(receipt.transactionHash)
//         }
//     })
    

// contract.events.MissedEthReceive()

//     .on('data', function (event) {
//         console.log('new MissedEthReceive Event');
//         Transaction.createTransaction(event)
//         const createdJob = new_gft_loss_benechng.createJob({ type: "MissedEthReceive", event: event })
//         createdJob.timeout(3000).retries(0).save();
//     })
//     .on('changed', function (event) {
//         Transaction.declinedTransaction(event.transactionHash, event.event)
//         Transaction.errTxnlog(event.transactionHash)

//     })
//     .on('error', function (error, receipt) {
//         console.log(error)
//         if (receipt) {
//             Transaction.errTxnlog(receipt.transactionHash)
//         }
//     })

// contract.events.SentExtraEthDividends()

//     .on('data', function (event) {
//         console.log('new SentExtraEthDividends Event');
//         Transaction.createTransaction(event)
//         const createdJob = new_gft_loss_benechng.createJob({ type: "SentExtraEthDividends", event: event })
//         createdJob.timeout(3000).retries(0).save();
//     })
//     .on('changed', function (event) {
//         Transaction.declinedTransaction(event.transactionHash, event.event)
//         Transaction.errTxnlog(event.transactionHash)

//     })
//     .on('error', function (error, receipt) {
//         console.log(error)
//         if (receipt) {
//             Transaction.errTxnlog(receipt.transactionHash)
//         }
//     })
    

// contract.events.BeneficieryChanged()

//     .on('data', function (event) {
//         console.log('new BeneficieryChanged Event');
//         Transaction.createTransaction(event)
//         const createdJob = new_gft_loss_benechng.createJob({ type: "BeneficieryChanged", event: event })
//         createdJob.timeout(3000).retries(0).save();
//     })
//     .on('changed', function (event) {
//         Transaction.declinedTransaction(event.transactionHash, event.event)
//         Transaction.errTxnlog(event.transactionHash)

//     })
//     .on('error', function (error, receipt) {
//         console.log(error)
//         if (receipt) {
//             Transaction.errTxnlog(receipt.transactionHash)
//         }
//     })


app.listen(process.env.PORT || 3003, () => {
    console.log(`Example app listening at http://localhost:${3003}`)
})





