const cron = require("node-cron");
const purchasenModel = require("../models/purchaseModel");
const { ABI, CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, RPC_URI, BITPAY_URL } = require("../config");
const { signAndSendTransaction, getGasPrice } = require("../utils/wallet");
const Web3 = require("web3");
const axios = require("axios");
const constant = require("../constants/constant");

const btcToUsbTokenExchangeService = async () => {
    if (!RPC_URI || !BITPAY_URL) {
        console.log("RPC_URI or BITPAY_URL not configured. Skipping btcToUsbTokenExchangeService.");
        return;
    }

    let web3Usb;
    try {
        web3Usb = new Web3(RPC_URI);
    } catch (e) {
        console.error("Failed to initialize Web3 in btcToUsbTokenExchangeService:", e.message);
        return;
    }

    cron.schedule("* * * * *", async () => {
        try {
            const documents = await purchasenModel.find({ 
                transferStatus: constant.constant.transferStatus.Pending, 
                type: constant.constant.currencyType.btc 
            });

            if (documents && documents.length > 0) {
                for (const document of documents) {
                    if (!document.transactionHash) continue;
                    let response;
                    const usdRate = document.conversionRate;
                    try {
                        response = await axios.get(`${BITPAY_URL}/tx/${document.transactionHash}`);
                    } catch (e) {
                        console.log("BTC transaction not confirmed or lookup failed:", e.message);
                        continue;
                    }

                    if (response && response.data && response.data.confirmations > 1) {
                        let gasPrice = (await getGasPrice()) * 2;
                        const gasLimit = 21000000;
                        const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);
                        const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
                        const targetAddress = document.userUSBWalletAddress || document.userUSBWalletAddres;
                        const tx1 = contract.methods.mint(targetAddress, parseInt(document.cryptoReceivedAmount * usdRate * 1e2));
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
                        await purchasenModel.updateOne({ _id: document._id }, {
                            $set: {
                                usbSentAmount: (document.cryptoReceivedAmount * usdRate),
                                transferStatus: constant.constant.transferStatus.Success,
                                transactionHashUSB: hash.transactionHash
                            }
                        });

                        console.log("Successfully transferred USB token against BTC received.");
                    } else {
                        console.log("BTC transaction not confirmed yet");
                        continue;
                    }
                }
            }
        } catch (error) {
            console.error("Error in transfer token service against BTC submit:", error);
        }
    });
};

module.exports = { btcToUsbTokenExchangeService };
