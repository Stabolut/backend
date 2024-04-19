const cron = require("node-cron");
const purchasenModel = require("../models/purchaseModel");
const { ABI, CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, RPC_URI, BITPAY_URL } = require("../config");
const { signAndSendTransaction, getGasPrice } = require("../utils/wallet");
const Web3 = require("web3");
const axios = require("axios");
const constant = require("../constants/constant"); // Importing constants
const web3Usb = new Web3(RPC_URI);

const btcToUsbTokenExchangeService = async () => {
    cron.schedule("* * * * *", async () => {
        try {
            console.log("Transfer token service started for btc...");
            const documents = await purchasenModel.find({ transferStatus: constant.constant.transferStatus.Pending, type: constant.constant.currencyType.btc });

            if (documents.length > 0) {

                for (const document of documents) {
                    let response
                    const usdRate = document.conversionRate;
                    try {
                        response = await axios.get(`${BITPAY_URL}/tx/${document.transactionHash}`);
                        console.log("response", response.data)
                    }
                    catch (e) {
                        console.log("Btc transaction not confirmed")
                        continue
                    }


                    if (response.data.confirmations > 1) {

                        let gasPrice = (await getGasPrice()) * 2;
                        const gasLimit = 21000000;
                        const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);
                        const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
                        const tx1 = contract.methods.mint(document.userUSBWalletAddres, parseInt(document.cryptoReceivedAmount * usdRate * 1e2));
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

                        console.log("Successfully transfer usb token against btc received.");
                    }
                    else {
                        console.log("Btc transaction not cofirmed yet")
                        continue
                    }
                }
            } else {
                console.log("No pending transactions found for btc.");
            }
        } catch (error) {
            console.error("Error in transfer token service against btc submit:", error);
        }
    });
};

module.exports = { btcToUsbTokenExchangeService };
