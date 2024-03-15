const TransactionModel = require("../models/TransactionModel")

module.exports = async (req, res) => {
    try {
        const { walletAddress, transactionHash, status } = req.body;
        let wallet = await TransactionModel.findOne({
            $and: [
                { $or: [{ senderAddress: walletAddress }, { receiverAddress: walletAddress }] },
                { transactionType: "Transfer" },
                { transactionStatus: "Pending" },
                { transactionHash: transactionHash }
            ]
        })
        console.log("Find walle", wallet)
        if (status === 1) {
            wallet.transactionStatus = "Success"
        }
        else if (status === 0) {
            wallet.transactionStatus = "Fail"

        }


        wallet.save()
        res.status(200).send("Transaction status update")

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
