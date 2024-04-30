const cron = require("node-cron"); // Importing node-cron for scheduling tasks
const purchasenModel = require("../models/purchaseModel"); // Importing the purchase model
const { ABI, CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, ETH_RPC_URL, RPC_URI } = require("../config"); // Importing necessary configurations
const { signAndSendTransaction, getGasPrice } = require("../utils/wallet"); // Importing functions for signing and sending transactions
const Web3 = require("web3"); // Importing Web3 for interacting with Ethereum blockchain
const constant = require("../constants/constant"); // Importing constants

// Creating Web3 instances for Ethereum and USB blockchains
const web3Eth = new Web3(ETH_RPC_URL);
const web3Usb = new Web3(RPC_URI);

// Function to exchange Ethereum for USB token
const ethToUsbTokenExchangeService = async () => {
    cron.schedule("* * * * *", async () => { // Scheduling the task to run every minute
        try {
          
            const documents = await purchasenModel.find({ transferStatus: constant.constant.transferStatus.Pending, type: constant.constant.currencyType.eth }); // Finding pending transactions for Ethereum

            if (documents.length > 0) { // If pending transactions are found
                for (const document of documents) { // Iterate over each pending transaction
                    const resp = await web3Eth.eth.getTransactionReceipt(document.transactionHash); // Get transaction receipt

                    if (!resp) { // If transaction is not confirmed yet
                        console.log("Transaction not confirmed yet. Please wait for confirmation.");
                        continue; // Continue to the next iteration
                    } else if (resp.status === false) { // If transaction failed
                        console.log("Transaction failed. Please check the transaction.");
                        continue; // Continue to the next iteration
                    } else if (resp.status === true) { // If transaction is successful
                        const tx = await web3Eth.eth.getTransaction(document.transactionHash); // Get transaction details
                        const depositAmount = tx.value; // Extract deposit amount
                        const usdRate = document.conversionRate; // Extract USD conversion rate

                        // Calculate gas price, gas limit, and nonce for transaction
                        let gasPrice = (await getGasPrice()) * 2;
                        const gasLimit = 21000000;
                        const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);

                        // Create contract instance and encode transaction data
                        const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
                        const tx1 = contract.methods.mint(document.userUSBWalletAddres, parseInt((depositAmount / 1e18) * usdRate * 1e2));
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

                        console.log("Successfully transfer usb token against ether received.");
                    }
                }
            } else {
               
            }
        } catch (error) {
            console.error("Error in transfer token service againt ether submit:", error); // Log any errors that occur during the process
        }
    });
};

module.exports = { ethToUsbTokenExchangeService }; // Exporting the function
