const cron = require("node-cron"); // Importing node-cron for scheduling tasks
const purchasenModel = require("../models/purchaseModel"); // Importing the purchase model
const { ABI, CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, ETH_RPC_URL, RPC_URI } = require("../config"); // Importing necessary configurations
const { signAndSendTransaction, getGasPrice } = require("../utils/wallet"); // Importing functions for signing and sending transactions
const Web3 = require("web3"); // Importing Web3 for interacting with Ethereum blockchain
const constant = require("../constants/constant"); // Importing constants

// Function to exchange Ethereum for USB token
const ethToUsbTokenExchangeService = async () => {
    if (!ETH_RPC_URL || !RPC_URI) {
        console.log("ETH_RPC_URL or RPC_URI not configured. Skipping ethToUsbTokenExchangeService.");
        return;
    }

    let web3Eth;
    let web3Usb;
    try {
        web3Eth = new Web3(ETH_RPC_URL);
        web3Usb = new Web3(RPC_URI);
    } catch (e) {
        console.error("Failed to initialize Web3 in ethToUsbTokenExchangeService:", e.message);
        return;
    }

    cron.schedule("* * * * *", async () => { // Scheduling the task to run every minute
        try {
            const documents = await purchasenModel.find({ 
                transferStatus: constant.constant.transferStatus.Pending, 
                type: constant.constant.currencyType.eth 
            });

            if (documents && documents.length > 0) {
                for (const document of documents) {
                    if (!document.transactionHash) continue;
                    const resp = await web3Eth.eth.getTransactionReceipt(document.transactionHash);

                    if (!resp) {
                        console.log("Transaction not confirmed yet. Please wait for confirmation.");
                        continue;
                    } else if (resp.status === false) {
                        console.log("Transaction failed. Please check the transaction.");
                        continue;
                    } else if (resp.status === true) {
                        const tx = await web3Eth.eth.getTransaction(document.transactionHash);
                        if (!tx || !tx.value) continue;
                        const depositAmount = tx.value;
                        const usdRate = document.conversionRate;
                        const targetAddress = document.userUSBWalletAddress || document.userUSBWalletAddres;

                        // Calculate gas price, gas limit, and nonce for transaction
                        let gasPrice = (await getGasPrice()) * 2;
                        const gasLimit = 21000000;
                        const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);

                        // Create contract instance and encode transaction data
                        const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
                        const tx1 = contract.methods.mint(targetAddress, parseInt((depositAmount / 1e18) * usdRate * 1e2));
                        const encodedTx = tx1.encodeABI();

                        // Build transaction object
                        const transactionObject = {
                            nonce: web3Usb.utils.toHex(nonce),
                            from: FUNDING_ADDRESS,
                            gasPrice: web3Usb.utils.toHex(gasPrice),
                            gasLimit: web3Usb.utils.toHex(gasLimit),
                            to: CONTRACT_ADDRESS,
                            data: encodedTx
                        };

                        // Sign and send transaction
                        const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY);

                        // Update purchase model with transaction details
                        await purchasenModel.updateOne({ _id: document._id }, {
                            $set: {
                                usbSentAmount: ((depositAmount / 1e18) * usdRate).toFixed(2),
                                cryptoReceivedAmount: depositAmount / 1e18,
                                transferStatus: constant.constant.transferStatus.Success,
                                transactionHashUSB: hash.transactionHash
                            }
                        });

                        console.log("Successfully transferred USB token against ether received.");
                    }
                }
            }
        } catch (error) {
            console.error("Error in transfer token service against ether submit:", error);
        }
    });
};

module.exports = { ethToUsbTokenExchangeService };
