const cron = require("node-cron");
const purchasenModel = require("../models/purchaseModel");
const { ABI, CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, RPC_URI, BITPAY_URL, TOKEN_DECIMAL } = require("../config");
const { signAndSendTransaction, getGasPrice, getNonce } = require("../utils/wallet");
const Web3 = require("web3");
const axios = require("axios");
const constant = require("../constants/constant"); // Importing constants
const walletModel = require("../models/walletModel");
const referralModel = require("../models/referralModel");
const web3Usb = new Web3(RPC_URI);

const sendReferralTokenService = async () => {
    cron.schedule("* * * * *", async () => {
        try {

            const documents = await referralModel.find({ isRewardTransfer: false });

            if (documents.length > 0) {

                for (const document of documents) {

                    let gasPrice = (await getGasPrice()) * 2;

                    const nonce = await getNonce(FUNDING_ADDRESS);
                    const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
                    let amountToMint = parseFloat(constant.constant.referralRewardAmount) * TOKEN_DECIMAL;
                    const tx1 = contract.methods.mint(document.referenceWallet, amountToMint);
                    const encodedTx = tx1.encodeABI();

                    // Construct transaction object
                    let estimateTransactionObject = {
                        nonce: global.web3.utils.toHex(nonce),
                        from: FUNDING_ADDRESS,
                        gasPrice: global.web3.utils.toHex(gasPrice),
                        to: CONTRACT_ADDRESS,
                        data: encodedTx,
                    };

                    const gasLimit = await web3.eth.estimateGas(estimateTransactionObject);

                    const transactionObject = {
                        nonce: web3Usb.utils.toHex(nonce),
                        from: FUNDING_ADDRESS,
                        gasPrice: web3Usb.utils.toHex(gasPrice),
                        gasLimit: web3Usb.utils.toHex(gasLimit),
                        to: CONTRACT_ADDRESS,
                        data: encodedTx
                    };

                    const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY);
                    await referralModel.updateOne({ _id: document._id }, {
                        $set: {
                            isRewardTransfer: true,
                            transactionHash: hash.transactionHash
                        }
                    });

                    console.log("Successfully transfer usb token against referral.");

                }
            } else {

            }
        } catch (error) {
            console.error("Error in transfer token service for referral:", error);
        }
    });
};

module.exports = { sendReferralTokenService };
