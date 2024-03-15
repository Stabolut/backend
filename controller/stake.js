
const { routeResponseWithData, errorResponse, routeResponseOnlyMessage } = require("../utils/responses")
const UserModel = require("../models/UserModel")
const AutomateStakeModel = require("../models/AutomateStakeModel")
const { isEmpty } = require("lodash")
const { getTokenBalance } = require("../utils/wallet")
const { isValidEthereumAddress, getGasPrice, getNonce,
    signAndSendTransaction, transferPreSignedHex } = require('../utils/wallet');
const { ErrorMessages } = require("../constants/errors");
const ContactListModel = require("../models/ContactList");
const StakeModel = require("../models/StakeModel")
const { InfoMessages } = require("../constants/messages");
const { CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY } = require('../config');
const WalletModel = require("../models/WalletModel")

addInStake = async (req, res) => {

    try {
        console.log("Req.", req.body)

        const { amount, wallet, signature, toAddress, amountToSend, nonce1 } = req.body;
        const yieldAmount = (amount * 2.5) / 100; // Calculate yield


        const gasPrice = await getGasPrice() * 1.3;

        const nonce = await getNonce(FUNDING_ADDRESS)

        const encoded_tx = await transferPreSignedHex(signature, toAddress, parseInt(amountToSend), parseInt(nonce1));

        let estimateTransactionObject = {
            nonce: global.web3.utils.toHex(nonce),
            from: FUNDING_ADDRESS,
            gasPrice: global.web3.utils.toHex(gasPrice),
            to: CONTRACT_ADDRESS,
            data: encoded_tx,

        };
        console.log("estimateTransactionObject", estimateTransactionObject)
        const gasLimit = await global.web3.eth.estimateGas(estimateTransactionObject)


        let transactionObject = {
            nonce: global.web3.utils.toHex(nonce),
            from: FUNDING_ADDRESS,
            gasPrice: global.web3.utils.toHex(gasPrice),
            gasLimit: global.web3.utils.toHex(gasLimit),
            to: CONTRACT_ADDRESS,
            // maxFeePerGas: global.web3.utils.toHex(maxFeePerGas),
            data: encoded_tx,
            // chainId: global.web3.utils.toHex(80001),
        };
        console.log("transactionObject", transactionObject)
        const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY)

        const staking = new StakeModel({ amount, yieldAmount, wallet, hash: hash.transactionHash });
        // will transfer this amount to admin
        await staking.save();
        return routeResponseWithData(res, true, InfoMessages.GENERIC.ITEM_ADD_SUCCESSFULLY("Stake"), { yieldAmount }, 200)
    } catch (error) {
        console.error('Error staking:', error);
        if (error.message) {
            return errorResponse(res, error.message, 404)
        }
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Add stake"), 404)
    }
}


getStakeList = async (req, res) => {

    try {

        let stakeList = await StakeModel.aggregate([
            { $match: { wallet: req.body.account } },
            { $sort: { "timestamps.created_At": -1 } },
            {
                $group: {
                    _id: null,
                    totalAmountInStake: { $sum: "$amount" },
                    stakeBucketsList: { $push: "$$ROOT" }
                }
            }
        ]);
        if (stakeList.length === 0) {
            stakeList = [{
                totalAmountInStake: 0,
                stakeBucketsList: []
            }]
        }

        return routeResponseWithData(res, true, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Stake"), stakeList, 200)
    } catch (error) {
        console.error('Error staking:', error);
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Get stake"), 404)
    }
}


allStakeTransactionList = async (req, res) => {

    try {
        let stakeList = []

        if (!isEmpty(req.query)) {
            stakeList = await AutomateStakeModel.aggregate([
                { $match: { wallet: req.body.wallet } },
                { $sort: { "timestamps.created_At": -1 } },
                { $limit: parseInt(req.query.limit) },
            ]);
        }
        else {
            stakeList = await AutomateStakeModel.aggregate([
                { $match: { wallet: req.body.wallet } },
                { $sort: { "timestamps.created_At": -1 } }
            ]);
        }
        return routeResponseWithData(res, true, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Stake transaction list"), stakeList, 200)
    } catch (error) {
        console.error('Error staking:', error);
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Stake transaction list"), 404)
    }
}


stakeReward = async (req, res) => {

  

    try {

        let totalAmount = 0
        let stakeList = await AutomateStakeModel.aggregate([
            { $match: { wallet: req.body.wallet } },
            {
                $group: {
                    _id: null,
                    rewardAmount: { $sum: "$rewardAmount" }
                }
            }
        ]);

        if (stakeList.length > 0) {
            totalAmount = stakeList[0].rewardAmount;

        }
        return routeResponseWithData(res, true, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Stake transaction list"), totalAmount, 200)
    } catch (error) {
        console.error('Error staking:', error);
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Stake transaction list"), 404)
    }
}

module.exports = {
    addInStake,
    getStakeList,
    // allStakeTransactionListByLimit,
    allStakeTransactionList,
    stakeReward

}