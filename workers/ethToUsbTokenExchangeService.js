const cron = require("node-cron"); // Importing node-cron for scheduling tasks
const purchasenModel = require("../models/purchaseModel"); // Importing the purchase model
const { ABI,ETH_RPC_URL, NETWORKS } = require("../config"); // Importing necessary configurations
const { signAndSendTransaction, getGasPrice, getNonce } = require("../utils/wallet"); // Importing functions for signing and sending transactions
const Web3 = require("web3"); // Importing Web3 for interacting with Ethereum blockchain
const constant = require("../constants/constant"); // Importing constants
const { getWebInstance } = require("../utils/utils");
// Creating Web3 instances for Ethereum and USB blockchains
const web3Eth = new Web3(ETH_RPC_URL);


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

                        let networkInfo = NETWORKS[constant.constant.network.Arbitrium]
                        let web3Instance = getWebInstance(constant.constant.network.Arbitrium)
                        const gasPrice = (await getGasPrice(web3Instance)) * 2;
                        const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);
                        const contract = new web3Instance.eth.Contract(ABI, networkInfo.contractAddress);

                        const tx = await web3Eth.eth.getTransaction(document.transactionHash); // Get transaction details
                        const depositAmount = tx.value; // Extract deposit amount
                        const usdRate = document.conversionRate; // Extract USD conversion rate


                        let mintObject = await contract.methods.mint(
                            document.userUSBWalletAddres,
                            parseInt((depositAmount / 1e18) * usdRate * 1e2)
                        );
                        const encodedTx = mintObject.encodeABI();

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
                        // Sign and send transaction

                        let hash = await signAndSendTransaction(transactionObject, networkInfo.fundingKey, web3Instance);

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
