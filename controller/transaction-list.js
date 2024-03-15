const TransactionModel = require("../models/TransactionModel")
const TransactionModelSolana = require("../models/TransactionModelSolana")

limitTransaction = async (req, res) => {
    try {


        const { walletAddress } = req.body;

        let wallet = await TransactionModel.find({
            $and: [
                { $or: [{ senderAddress: walletAddress }, { receiverAddress: walletAddress }] },
                { transactionType: "Transfer" }
            ]
        }).sort({ "timestamps.created_At": -1 }).limit(5)

        res.status(200).json({ wallet })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


allTransaction = async (req, res) => {
    try {


        const { walletAddress } = req.body;

        let wallet = await TransactionModel.find({
            $and: [
                { $or: [{ senderAddress: walletAddress }, { receiverAddress: walletAddress }] },
                { transactionType: "Transfer" }
            ]
        }).sort({ "timestamps.created_At": -1 })

        res.status(200).json({ wallet })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    limitTransaction,
    allTransaction

}