const { ABI, NETWORKS, TOKEN_DECIMAL } = require("../config")
const constant = require("../constants/constant")
const transactionModel = require("../models/transactionModel")
const { getWebInstance } = require("../utils/utils")
const { getGasPrice, getNonce, signAndSendTransaction } = require("../utils/wallet")

const coinMint = async (walletAddress, amount, network) => {

    try {
        //Arbitrium
        let networkInfo = NETWORKS[network]
        let web3Instance = getWebInstance(network)
        const gasPrice = (await getGasPrice(web3Instance)) * 2;
        const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);
        const contract = new web3Instance.eth.Contract(ABI, networkInfo.contractAddress);

        let tx1 = await contract.methods.mint(
            walletAddress,
            parseInt(amount * TOKEN_DECIMAL)
        );
        const encodedTx = tx1.encodeABI();
        // Construct transaction object
        let estimateTransactionObject = {
            nonce: web3Instance.utils.toHex(nonce),
            from: networkInfo.fundingAddress,
            gasPrice: web3Instance.utils.toHex(gasPrice),
            to: networkInfo.contractAddress,
            data: encodedTx,
        };
        const gasLimit = await web3Instance.eth.estimateGas(estimateTransactionObject);
        let transactionObject = {
            nonce: web3Instance.utils.toHex(nonce),
            from: networkInfo.fundingAddress,
            gasPrice: web3Instance.utils.toHex(gasPrice),
            gasLimit: web3Instance.utils.toHex(gasLimit),
            to: networkInfo.contractAddress,
            data: encodedTx,

        };


        await signAndSendTransaction(transactionObject, networkInfo.fundingKey, web3Instance);
     
        // let transactionFound = await transactionModel.findOne({ transactionHash: hash.transactionHash })
        // console.log("transactionFound", transactionFound)
        // let newTransaction
        // if (transactionFound) {
        //     console.log("insidebvbcb")
        //     newTransaction = await transactionModel.updateOne(
        //         { _id: transactionFound._id }, // Filter by wallet address and network name
        //         { $set: { transactionType: "Free Mint", amountToSend: constant.constant.freeUSBLimit, senderAddress: networkInfo.fundingAddress } } // Reset the reward amount on staking to zero
        //     );
        // }
        // else {

        //     let transaction = {
        //         senderAddress: constant.constant.contractInternalTransactionAddress,
        //         receiverAddress: walletAddress,
        //         amountToSend: constant.constant.freeUSBLimit,
        //         transactionHash: hash.transactionHash,
        //         sendDate: new Date(),
        //         network: network,
        //         transactionType: "Free Mint"
        //     };
        //     const newTransaction = new transactionModel(transaction);
        //     await newTransaction.save();
        // }
        return
    }
    catch (e) {
        console.log(`e ${network}`, e)

    }
}


module.exports = { coinMint };
