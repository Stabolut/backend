
const Web3 = require("web3");
const web3 = new Web3();
const Web3EthAccounts = require("web3-eth-accounts");


const newWeb3Connection = async (RPC_URI) => {
    return new Promise(async (resolve, reject) => {
        try {
            web3.setProvider(new web3.providers.HttpProvider(RPC_URI));
            global.web3 = web3;
            const account = new Web3EthAccounts(RPC_URI);
            global.account = account;
            resolve();

        } catch (e) {
            console.log("Connection Failed !")
        }
    })
};

const getWeb3Connection = () => global.web3;

module.exports = {newWeb3Connection, getWeb3Connection }