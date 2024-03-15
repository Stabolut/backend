const { CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY } = require('../config');
const _ = require('lodash');
const TransactionModel = require("../models/TransactionModel")
const { sendNotification } = require('../NotificationService')
const WalletModel = require('../models/WalletModel')
const { isValidEthereumAddress, getGasPrice, getNonce,
    signAndSendTransaction, transferPreSignedHex } = require('../utils/wallet')


module.exports = async (req, res) => {
    try {

        const body = _.pick(req.body, [
            'signature',
            'toAddress',
            'amount',
            'nonce',
            'senderAddress',
            'originalAmount',
            'transNotes'
        ]);
        console.log("i am hit", req.body)




        if (!isValidEthereumAddress(body.toAddress)) return res.status(400).json({ message: "recipient address is invalid" })
        // if(!body.signature || !body.amount || !body.toAddress || !body.nonce) return  res.status(400).json({msg: "body parameter is missing !"})
        const gasPrice = await getGasPrice() * 2;
        const nonce = await getNonce(FUNDING_ADDRESS)
        const encoded_tx = await transferPreSignedHex(body.signature, body.toAddress, parseInt(body.amount), parseInt(body.nonce));

        let estimateTransactionObject = {
            nonce: global.web3.utils.toHex(nonce),
            from: FUNDING_ADDRESS,
            gasPrice: global.web3.utils.toHex(gasPrice),
            to: CONTRACT_ADDRESS,
            data: encoded_tx,

        };
        console.log("estimateTransactionObject", estimateTransactionObject)
        const gasLimit = await web3.eth.estimateGas(estimateTransactionObject)

        let transactionObject = {
            nonce: global.web3.utils.toHex(nonce),
            from: FUNDING_ADDRESS,
            gasPrice: global.web3.utils.toHex(gasPrice),
            gasLimit: global.web3.utils.toHex(gasLimit),
            to: CONTRACT_ADDRESS,
            data: encoded_tx,
            // chainId: global.web3.utils.toHex(80001),
        };
        console.log("transactionObject", transactionObject)

        const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY)
        // here we send transaction to the user 
        let token = await WalletModel.findOne({ account: body.toAddress })

        if (token) {
            let receiveTokenArray = token.tokenArray
            for (var i = 0; i < receiveTokenArray.length; i++) {
                console.log("receiveTokenArray[i].token", receiveTokenArray[i].token)
                if (receiveTokenArray[i].token) sendNotification(receiveTokenArray[i].token, `You received ${body.originalAmount} USB from ${body.toAddress}`, "Received USB", "", { address: body.toAddress })
            }
        }


        let findTransaction = await TransactionModel.findOne({
            senderAddress: body.senderAddress,
            receiverAddress: body.toAddress,
            amountToSend: body.amount / 1e2,
            transactionHash: hash.transactionHash,
        })
        console.log("findTransaction", findTransaction)

        if (!findTransaction) {

            let transaction = {
                senderAddress: body.senderAddress,
                receiverAddress: body.toAddress,
                amountToSend: body.amount / 1e2,
                transactionHash: hash.transactionHash,
                sendDate: new Date(),
                transactionNotes: body.transNotes

            }
            console.log("transaction", transaction)
            const newTransaction = new TransactionModel(transaction)
            await newTransaction.save()
            console.log("Data Save")
        }

        return res.json({ "txnHash": hash })

    } catch (err) {
        console.log("e", err)
        res.status(500).json({
            message: err.message
        })
    }
}