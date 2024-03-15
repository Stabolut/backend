
const TransactionModelSolana = require("../models/TransactionModelSolana")
module.exports = async (req, res) => {
    try {

        const { walletAddress } = req.body;

        let wallet = await TransactionModelSolana.find({}).sort({sendDate:-1})

        res.status(200).json({ wallet })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
