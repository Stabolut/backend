const { ABI, NETWORKS, TOKEN_DECIMAL } = require("../config")
const constant = require("../constants/constant")
const transactionModel = require("../models/transactionModel")
const walletModel = require("../models/walletModel")
const deviceRewardModel = require("../models/deviceRewardModel")
const { getWebInstance } = require("../utils/utils")
const { getGasPrice, getNonce, signAndSendTransaction } = require("../utils/wallet")

const coinMint = async (walletAddress, amount, network, deviceId) => {

    try {
        let wallet = await walletModel.findOne({ account: walletAddress.toLowerCase() })
        if (!wallet) return
        if (wallet.intialCoinTransfer) {
            console.log("Already transfer to this wallet")
            return
        }
        if (!deviceId) {
            console.log("no device id found")
            return
        }
        let deviceExist = await deviceRewardModel.findOne({ deviceId: deviceId })
        if (deviceExist) {
            console.log("Already taken reward from this device")
            return
        }

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

        await walletModel.updateOne(
            { account: walletAddress.toLowerCase() }, // Filter by wallet address and network name
            { $set: { intialCoinTransfer: true } } // Reset the reward amount on staking to zero
        );
        await deviceRewardModel.create({
            deviceId: deviceId,
            isRewardClaim: true
        });





        return
    }
    catch (e) {
        console.log(`e ${network}`, e)

    }
}


module.exports = { coinMint };
