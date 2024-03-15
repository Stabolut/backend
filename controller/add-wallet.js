const WalletModel = require("../models/WalletModel");
const { getTokenBalance } = require("../utils/wallet");

module.exports = async (req, res) => {
  try {
    const existingWallet = await WalletModel.findOne({
      account: req.body.account,
    });

    if (existingWallet) {
      // Wallet document with the given account already exists.
      if (existingWallet.tokenArray.some((t) => t.token === req.body.token)) {
        // Token already exists in the TokenArray.
        return res.status(200).send("Token already exists in the TokenArray");
      } else {
        // Token does not tokenArray in the TokenArray, so add it.
        existingWallet.tokenArray.push({ token: req.body.token });
        existingWallet.save();
        return res
          .status(200)
          .send("Token does not exist in the TokenArray, so add it.");
      }
    } else {
      let balance = await getTokenBalance(req.body.account);
      // Wallet document with the given account does not exist, so create it.
      const newWallet = new WalletModel({
        account: req.body.account,
        balance: parseFloat(balance / 1e2),
        tokenArray: [{ token: req.body.token }],
      });
      //set user balance for staking
      newWallet.save();
      return res
        .status(200)
        .send(
          "Wallet document with the given account does not exist, so create it."
        );
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.message,
    });
  }
};
