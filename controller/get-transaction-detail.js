
const { CONTRACT_ADDRESS } = require('../config');

module.exports = async (req, res) => {
    try {
        

       

    } catch (err) {
        res.status(500).json({
            invalidrequest: err.message
        })
    }
}
