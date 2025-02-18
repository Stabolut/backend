const cron = require("node-cron");
const purchasenModel = require("../models/purchaseModel");
const { ABI, CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, RPC_URI, BITPAY_URL, TOKEN_DECIMAL, NETWORKS } = require("../config");
const { signAndSendTransaction, getGasPrice, getNonce } = require("../utils/wallet");
const Web3 = require("web3");
const axios = require("axios");
const constant = require("../constants/constant"); // Importing constants
const walletModel = require("../models/walletModel");
const referralModel = require("../models/referralModel");
const { getWebInstance } = require("../utils/utils");
const web3Usb = new Web3(RPC_URI);

const sendReferralTokenService = async () => {
    cron.schedule("* * * * *", async () => {
        try {

            const documents = await referralModel.find({ isRewardTransfer: false });

            if (documents.length > 0) {

                for (const document of documents) {
                    let networkInfo = NETWORKS[constant.constant.network.Arbitrium]
                    let web3Instance = getWebInstance(constant.constant.network.Arbitrium)

                    let gasPrice = (await getGasPrice(web3Instance)) * 2;

                    const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);
                    const contract = new web3Instance.eth.Contract(ABI, networkInfo.contractAddress);
                    let amountToMint = parseFloat(constant.constant.referralRewardAmount) * TOKEN_DECIMAL;
                    const tx1 = contract.methods.mint(document.referenceWallet, amountToMint);
                    const encodedTx = tx1.encodeABI();

                    // Construct transaction object
                    let estimateTransactionObject = {
                        nonce: web3Instance.utils.toHex(nonce),
                        from: networkInfo.fundingAddress,
                        gasPrice: web3Instance.utils.toHex(gasPrice),
                        to: networkInfo.contractAddress,
                        data: encodedTx,
                    };

                    const gasLimit = await web3Instance.eth.estimateGas(estimateTransactionObject);

                    const transactionObject = {
                        nonce: web3Instance.utils.toHex(nonce),
                        from: networkInfo.fundingAddress,
                        gasPrice: web3Instance.utils.toHex(gasPrice),
                        gasLimit: web3Instance.utils.toHex(gasLimit),
                        to: networkInfo.contractAddress,
                        data: encodedTx
                    };

                    const hash = await signAndSendTransaction(transactionObject, networkInfo.fundingKey, web3Instance);
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
