const cron = require("node-cron");
const purchasenModel = require("../models/purchaseModel");
const { ABI, CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, RPC_URI, BITPAY_URL } = require("../config");
const { signAndSendTransaction, getGasPrice } = require("../utils/wallet");
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
                    const gasLimit = 21000000;
                    const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);
                    const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
                    const tx1 = contract.methods.mint(document.referenceWallet, parseInt(constant.constant.referralRewardAmount * 1e2));
                    const encodedTx = tx1.encodeABI();
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
