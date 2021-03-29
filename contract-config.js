const Web3 = require('web3');
// const Hyper = require('../../client/src/contracts/Hyper.json');

const Hyper = require('./abi').hyper

const wss_url = "wss://ropsten.infura.io/ws/v3/f9d741db28ba4802b253f1cdae45f150"

let provider = new Web3.providers.WebsocketProvider(wss_url);

const web3 = new Web3(provider)


// const deployedNetwork = Hyper.networks["5777"];

const contract = new web3.eth.Contract(
    Hyper.abi, Hyper.address
);

module.exports = contract;

