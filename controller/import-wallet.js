
const { importWallet } = require('../utils/wallet')

module.exports = async (req, res) => {
    try {
        
        const { privateKey } = req.body;

        const wallet = await importWallet(privateKey);
        res.json(wallet)
       

    } catch (err) {
        res.status(500).json({
            invalidrequest: err.message
        })
    }
}
