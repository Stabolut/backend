
const { createWallet } = require('../utils/wallet')

module.exports = async (req, res) => {
    try {
        
        const wallet = await createWallet();
        res.json(wallet)
       

    } catch (err) {
        res.status(500).json({
            invalidrequest: err.message
        })
    }
}
