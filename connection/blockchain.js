const Web3 = require("web3");
const { RPC_URI } = require("../config");
const web3 = new Web3();
const Web3EthAccounts = require("web3-eth-accounts");

const newWeb3Connection = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      web3.setProvider(new web3.providers.HttpProvider(RPC_URI));
      global.web3 = web3;
      const account = new Web3EthAccounts(RPC_URI);
      global.account = account;
      console.log("Connected to WEB3 Blockchain!");
      resolve();
    } catch (e) {
      console.log(`Error connection to WEB3 blockchain: ${e.message}`);
      console.log("Retrying connection to WEB3 blockchain...");
      setTimeout(newWeb3Connection, 5000);
    }
  });
};

module.exports = newWeb3Connection;
