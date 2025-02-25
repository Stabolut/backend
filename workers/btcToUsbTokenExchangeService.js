const cron = require("node-cron");
const purchasenModel = require("../models/purchaseModel");
const { ABI, FUNDING_KEY, BITPAY_URL, NETWORKS } = require("../config");
const { signAndSendTransaction, getGasPrice, getNonce } = require("../utils/wallet");
const Web3 = require("web3");
const axios = require("axios");
const constant = require("../constants/constant"); // Importing constants
const { getWebInstance } = require("../utils/utils");


const btcToUsbTokenExchangeService = async () => {
    cron.schedule("* * * * *", async () => {
        try {

            const documents = await purchasenModel.find({ transferStatus: constant.constant.transferStatus.Pending, type: constant.constant.currencyType.btc });

            if (documents.length > 0) {

                for (const document of documents) {
                    let response

                    try {
                        response = await axios.get(`${BITPAY_URL}/tx/${document.transactionHash}`);
                        console.log("response", response.data.status.confirmed)

                    }
                    catch (e) {
                        console.log("Btc transaction not confirmed", e, `${BITPAY_URL}/tx/${document.transactionHash}`)
                        continue
                    }


                    if (response.data.status.confirmed === true) {

                        let networkInfo = NETWORKS[constant.constant.network.Arbitrium]
                        let web3Instance = getWebInstance(constant.constant.network.Arbitrium)
                        const gasPrice = (await getGasPrice(web3Instance)) * 2;
                        const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);
                        const contract = new web3Instance.eth.Contract(ABI, networkInfo.contractAddress);
                        const usdRate = document.conversionRate; // Extract USD conversion rate
                        const tx1 = contract.methods.mint(document.userUSBWalletAddres, parseInt(document.cryptoReceivedAmount * usdRate * 1e2));
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

                        // Build transaction object
                        let transactionObject = {
                            nonce: web3Instance.utils.toHex(nonce),
                            from: networkInfo.fundingAddress,
                            gasPrice: web3Instance.utils.toHex(gasPrice),
                            gasLimit: web3Instance.utils.toHex(gasLimit),
                            to: networkInfo.contractAddress,
                            data: encodedTx,

                        };

                        let hash = await signAndSendTransaction(transactionObject, networkInfo.fundingKey, web3Instance);

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

            }
        } catch (error) {
            console.error("Error in transfer token service against btc submit:", error);
        }
    });
};

module.exports = { btcToUsbTokenExchangeService };
