// Importing required modules
const Web3 = require("web3");
const {
  CONTRACT_ADDRESS,
  FUNDING_ADDRESS,
  SOCKET_URI,
  ABI,
} = require("./config");
const TransactionModel = require("./models/TransactionModel");

/**
 * Function to listen for contract events and save transactions
 */
const runScript = () => {
  // Creating a new instance of Web3 with WebSocket provider
  const web3 = new Web3(new Web3.providers.WebsocketProvider(SOCKET_URI));

  try {
    // Creating a contract instance
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    // Listening for Transfer events emitted by the contract
    contract.events.Transfer({ fromBlock: "latest" }, async (error, event) => {
      // Handling errors
      if (error) {
        console.error(error);
        return;
      }

      // Initializing transaction type
      let transactionTransferType = "Transfer";
      let transaction;

      // Finding existing transaction in the database
      let findTransaction = await TransactionModel.findOne({
        senderAddress: event?.returnValues?.from,
        receiverAddress: event?.returnValues?.to,
        amountToSend: parseFloat(event?.returnValues?.value) / 1e2,
        transactionHash: event.transactionHash,
      });

      // Creating transaction object if not found in database
      if (!findTransaction) {
        // Checking if transaction is a fee transaction
        if (event?.returnValues?.to === FUNDING_ADDRESS) {
          transactionTransferType = "Fee";
          transaction = {
            senderAddress: event?.returnValues?.from,
            receiverAddress: event?.returnValues?.to,
            amountToSend: parseFloat(event?.returnValues?.value) / 1e2,
            transactionHash: event.transactionHash,
            transactionType: transactionTransferType,
            transactionStatus: "Success",
            sendDate: new Date(),
          };
        } else {
          // Otherwise, it's a regular transaction
          transaction = {
            senderAddress: event?.returnValues?.from,
            receiverAddress: event?.returnValues?.to,
            amountToSend: parseFloat(event?.returnValues?.value) / 1e2,
            transactionHash: event.transactionHash,
            transactionType: transactionTransferType,
            sendDate: new Date(),
          };
        }

        // Saving the new transaction to the database
        const newTransaction = new TransactionModel(transaction);
        await newTransaction.save();
        console.log("Transaction saved in script");
      }
    });
  } catch (e) {
    console.log("Run script failed", e);
  }
};

// Exporting the runScript function for use in other parts of the application
module.exports = runScript;
