const Web3 = require("web3");
const { RPC_URI, XDC_URI } = require("../config");
const Web3EthAccounts = require("web3-eth-accounts");

const web3 = new Web3();
const web3xdc = new Web3();

const newWeb3Connection = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Connect to the main Web3 blockchain
      web3.setProvider(new web3.providers.HttpProvider(RPC_URI));
      global.web3 = web3;
      const account = new Web3EthAccounts(RPC_URI);
      global.account = account;

      // Connect to the XDC-compatible Web3 blockchain
      web3xdc.setProvider(new web3xdc.providers.HttpProvider(XDC_URI));
      global.web3xdc = web3xdc;

      console.log("Connected to WEB3 and XDC-compatible Blockchain!");
      resolve();
    } catch (e) {
      console.log(`Error connecting to blockchain: ${e.message}`);
      console.log("Retrying connection to blockchain...");
      setTimeout(newWeb3Connection, 5000);
    }
  });
};

module.exports = newWeb3Connection;
