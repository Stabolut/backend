runScript = () => {

  const Web3 = require('web3');
  const { CONTRACT_ADDRESS, FUNDING_ADDRESS, SOCKET_URI, ABI } = require('./config');
  const web3 = new Web3(new Web3.providers.WebsocketProvider(SOCKET_URI));
  const TransactionModel = require("./models/TransactionModel")

  // Create a contract object
  try {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    contract.events.Transfer({ fromBlock: 'latest' }, async (error, event) => {
      if (error) {
        console.error(error);
        return;
      }
    


      let transactionTransferType = "Transfer"
      let transaction


      let findTransaction = await TransactionModel.findOne({
        senderAddress: event?.returnValues?.from,
        receiverAddress: event?.returnValues?.to,
        amountToSend: parseFloat(event?.returnValues?.value) / 1e2,
        transactionHash: event.transactionHash,


      })
    

      if (!findTransaction) {

        if (event?.returnValues?.to === FUNDING_ADDRESS) {
          transactionTransferType = "Fee"
          transaction = {
            senderAddress: event?.returnValues?.from,
            receiverAddress: event?.returnValues?.to,
            amountToSend: parseFloat(event?.returnValues?.value) / 1e2,
            transactionHash: event.transactionHash,
            transactionType: transactionTransferType,
            transactionStatus: "Success",
            sendDate: new Date()
          }
        }
        else {
          console.log("event",event)
          transaction = {
            senderAddress: event?.returnValues?.from,
            receiverAddress: event?.returnValues?.to,
            amountToSend: parseFloat(event?.returnValues?.value) / 1e2,
            transactionHash: event.transactionHash,
            transactionType: transactionTransferType,
            sendDate: new Date()
          }

        }
        const newTransaction = new TransactionModel(transaction)
        await newTransaction.save()
        console.log("Transaction save in script")
      }
    })
  }
  catch (e) {
    console.log("Run script fail", e)

  }
}

module.exports = runScript





