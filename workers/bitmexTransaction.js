const axios = require("axios");
const bitmexTransactionModel = require("../models/bitmexTransactionModel")


const BITMEX_ADDRESS = "tb1q3s09pky82ds4zk5wmj4t49q87cah4ysnxgaa0y";
const BLOCKSTREAM_API = `https://blockstream.info/testnet/api/address/${BITMEX_ADDRESS}/txs`;
const emailUtility = require("../utils/emailUtility");
const { transactionReceivedEmail } = require("../config");


// Function to fetch transactions
async function fetchTransactions() {
    try {
        const { data } = await axios.get(BLOCKSTREAM_API);
        console.log("daaaa", data.length)

        for (const tx of data) {
            const existingTx = await bitmexTransactionModel.findOne({ txid: tx.txid });
            console.log("already exist")
            if (!existingTx) {
                const newTx = new bitmexTransactionModel({
                    txid: tx.txid,
                    address: BITMEX_ADDRESS,
                    amount: tx.vout.reduce((sum, v) => (v.scriptpubkey_address === BITMEX_ADDRESS ? sum + v.value : sum), 0),
                    timestamp: new Date(tx.status.block_time * 1000),
                    confirmations: tx.status.confirmed ? 1 : 0,
                });
                await newTx.save();
                console.log("Saved transaction:", newTx);
            }
            try {
                await emailUtility.transporter.sendMail(
                    emailUtility.mailOptions(
                        'fahadhali329@gmail.com',
                        'joinnnnnnn',
                        transactionReceivedEmail()
                    )
                );
            }
            catch (e) {

            }
            console.log("Saved in db")
        }
    } catch (error) {
        console.error("Error fetching transactions:", error.message);
    }
}

// Function to start tracking transactions
function startTransactionTracking() {
    console.log("Transaction tracking service started...");
    fetchTransactions(); // Initial fetch
    setInterval(fetchTransactions, 30000); // Poll every 30 seconds
}

module.exports = { startTransactionTracking };
