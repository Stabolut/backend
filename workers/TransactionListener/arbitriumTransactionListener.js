// Importing required modules
const Web3 = require("web3");
const {
  ABI,
  TOKEN_DECIMAL,
} = require("../../config");
const transactionModel = require("../../models/transactionModel");


/**
 * Function to listen for contract events and save transactions
 */
const arbitriumTransactionListener = () => {


  // Creating a new instance of Web3 with WebSocket provider
  const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ARB_SOCKET_URI));

  try {
    // Creating a contract instance
    const contract = new web3.eth.Contract(ABI, process.env.ARB_CONTRACT_ADDRESS);

    // Listening for Transfer events emitted by the contract
    contract.events.Transfer({ fromBlock: "latest" }, async (error, event) => {

      // Handling errors
      if (error) {
        console.error(error);
        return;
      }
      console.log("Event1", event.transactionHash)

      // Initializing transaction type
      let transactionTransferType = "Transfer";
      let transaction;
      // console.log("event?.returnValues?.value", event)

      // Finding existing transaction in the database
      let findTransaction = await transactionModel.findOne({
        // senderAddress: { $regex: new RegExp(`^${event?.returnValues?.from}$`, 'i') },
        // receiverAddress: { $regex: new RegExp(`^${event?.returnValues?.to}$`, 'i') },
        transactionHash: event.transactionHash,
      });

      console.log("Event1 hash", findTransaction)
      // Creating transaction object if not found in database
      if (!findTransaction) {
        // Checking if transaction is a fee transaction
        if (event?.returnValues?.to === process.env.ARB_FUNDING_ADDRESS) {

          transactionTransferType = "Fee";
          transaction = {
            senderAddress: event?.returnValues?.from,
            receiverAddress: event?.returnValues?.to,
            amountToSend: parseFloat(event?.returnValues?.value) / TOKEN_DECIMAL,
            transactionHash: event.transactionHash,
            transactionType: transactionTransferType,
            transactionStatus: "Success",
            sendDate: new Date(),
            network: "Arbitrium"
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
            network: "Arbitrium"
          };
        }

        //Saving the new transaction to the database
        const newTransaction = new transactionModel(transaction);
        await newTransaction.save();
        console.log("Transaction saved in script", transaction);
      }

    });
  } catch (e) {
    console.log("Run script failed", e);
  }
};
module.exports = { arbitriumTransactionListener };
