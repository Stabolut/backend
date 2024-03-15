
const { getTokenBalance } = require('../utils/wallet')

module.exports = async (req, res) => {
    try {
        
        const balance = await getTokenBalance(req.params.address);
        res.json({"balance" : balance})

} catch (err) {
        res.status(500).json({
            invalidrequest: err.message
        })
    }
}
