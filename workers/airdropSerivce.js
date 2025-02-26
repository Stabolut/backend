const cron = require("node-cron");
const walletModel = require("../models/walletModel");
const { getTokenBalance, getGasPrice, getNonce, signAndSendTransaction } = require("../utils/wallet");
const { NETWORKS, ABI, TOKEN_DECIMAL } = require("../config");
const constant = require("../constants/constant"); // Importing constants
const { getWebInstance } = require("../utils/utils");
const airdropModel = require("../models/airdropModel");


const runTask = async () => {
    try {
        const walletList = await walletModel.find({});
        let networkInfo = NETWORKS[constant.constant.network.Arbitrium]
        let web3Instance = getWebInstance(constant.constant.network.Arbitrium)

        if (walletList.length > 0) {
            for (var account of walletList) {

                let balance = await getTokenBalance(account.account, networkInfo.contractAddress, web3Instance);
                let actualBalance = balance / TOKEN_DECIMAL; // Convert from smallest unit to readable tokens
                let airdropAmount = actualBalance * constant.constant.airdrop; // 0.1% of balance
                // Fix floating-point precision issue for display purposes only
                let displayAirdropAmount = parseFloat(airdropAmount.toFixed(2));

                // Calculate finalAirdropAmount directly from the unscaled airdropAmount
                let finalAirdropAmount = Math.round(airdropAmount * TOKEN_DECIMAL);

                if (airdropAmount > 0) {

                    const gasPrice = (await getGasPrice(web3Instance)) * 2;
                    const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);
                    const contract = new web3Instance.eth.Contract(ABI, networkInfo.contractAddress);

                    let mintObject = await contract.methods.mint(
                        account.account,
                        finalAirdropAmount
                    );
                    const encodedTx = mintObject.encodeABI();


                    // Construct transaction object
                    let estimateTransactionObject = {
                        nonce: web3Instance.utils.toHex(nonce),
                        from: networkInfo.fundingAddress,
                        gasPrice: web3Instance.utils.toHex(gasPrice),
                        to: networkInfo.contractAddress,
                        data: encodedTx,
                    };

                    const gasLimit = await web3Instance.eth.estimateGas(estimateTransactionObject);

                    // Build transaction object
                    let transactionObject = {
                        nonce: web3Instance.utils.toHex(nonce),
                        from: networkInfo.fundingAddress,
                        gasPrice: web3Instance.utils.toHex(gasPrice),
                        gasLimit: web3Instance.utils.toHex(gasLimit),
                        to: networkInfo.contractAddress,
                        data: encodedTx,

                    };
                    // Sign and send transaction

                    let hash = await signAndSendTransaction(transactionObject, networkInfo.fundingKey, web3Instance);

                    let airdropObject = {
                        airdropAmount: displayAirdropAmount,
                        userBalance: actualBalance,
                        walletAddress: account.account,
                        transactionHash: hash.transactionHash,
                        network: "Arbitrium"
                    };

                    //Saving the new transaction to the database
                    const airdrop = new airdropModel(airdropObject);
                    await airdrop.save();
                } else {
                    console.log(`Skipping airdrop for ${account.account} due to zero amount`);
                }
            }
        }
    } catch (e) {
        console.log("catch", e)
    }
};

const AirdropService = async () => {
    cron.schedule("0 0 * * *", async () => { // Runs every 24 hours at midnight UTC
        try {
            console.log("Airdrop service started");
            await runTask();
        } catch (e) {
            console.log("catch", e);
        }
    });
};
module.exports = { AirdropService };
