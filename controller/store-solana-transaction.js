
// const TransactionModel = require("../models/TransactionModel")
// const web3 = require('@solana/web3.js');
// const connection = new web3.Connection('https://flashy-convincing-film.solana-mainnet.discover.quiknode.pro/7d5f5f1e87ab99f028c521835ac0bf188b2d42a3/');
const TransactionModelSolana = require("../models/TransactionModelSolana")
module.exports = async (req, res) => {
    try {

        if (!req.body.explorer_url) return res.status(400).json({ msg: "explorer_url is missing !" })

        let newTransaction = await TransactionModelSolana.findOne({
            "_id": "63f625758abd8365fad0e968"
        });


        console.log(newTransaction)

        newTransaction.explorer_url = req.body.explorer_url;
        newTransaction.save()

        return res.status(200).json({

            message: "Solana Explorer Link Updated",
            data: {
                explorer_url: req.body.explorer_url,
                sendDate: new Date()
            }
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}




