// const { getPendingBtcTranaferTransaction, getUserByID } = require("./db")
// const { BITCOIN_NODE_URI, ADMIN_BTC_ADDRESS, BITCOIN_TOKEN, BITPAY_URL } = require("./config")
// const axios = require("axios")
// const { decryptWallet } = require("./utils/helperMethod")
// const AdminBtcTransferModel = require("./models/AdminBtcTransferModel")
// const request = require('request');
// const bitcoin = require("bitcoinjs-lib");
// const ecpair = require('ecpair');


transferBtcScript = async () => {
    // let pendingBtcTransaction
    // try {
    //     pendingBtcTransaction = await getPendingBtcTranaferTransaction()


    //     if (pendingBtcTransaction.length > 0) {

    //         for (var i = 0; i < pendingBtcTransaction.length; i++) {

    //             //get user wallet
    //             let user = await getUserByID(pendingBtcTransaction[i].chatID)
    //             let userWallet = await decryptWallet(user.bitcoinWallet)

    //             let update = await AdminBtcTransferModel.updateOne({ _id: pendingBtcTransaction[i]._id }, {
    //                 $set: {
    //                     adminBtcTransfer: true
    //                 }
    //             })

    //             if (update.modifiedCount == 1) {

    //                 // now we transfer amount to admin account
    //                 // let response = await axios.get(`${BITCOIN_NODE_URI}/addrs/${userWallet.address}/balance?token=${BITCOIN_TOKEN}`)
    //                 let response = await axios.get(`${BITPAY_URL}/address/${userWallet.address}/balance`)
    //                 let accounBlanace = response.data.balance / 100000000
    //                 console.log("accounBlanace", accounBlanace)
    //                 let btcToSantoshi = accounBlanace * 100000000
    //                 console.log("santoshi", btcToSantoshi)
    //                 await sendBitcoin(btcToSantoshi, ADMIN_BTC_ADDRESS, userWallet.address, userWallet.private)

    //             }
    //             else {

    //                 await AdminBtcTransferModel.updateOne({ _id: pendingBtcTransaction[i]._id }, {
    //                     $set: {
    //                         adminBtcTransfer: false
    //                     }
    //                 })
    //             }

    //         }
    //     }
    //     else {
    //         console.log("Not found any transsaction")

    //     }


    // }
    // catch (e) {
    //     console.log("Error")
    //     await AdminBtcTransferModel.updateOne({ _id: pendingBtcTransaction[i]._id }, {
    //         $set: {
    //             adminBtcTransfer: false
    //         }
    //     })
    // }
  
        console.log("I am run first time")
    


}

// const sendBitcoin = async function (amount, to, from, wif) {
//     try {

//         let response = await axios.get(`${BITPAY_URL}/fee/22`)
//         var bitcoin = require("bitcoinjs-lib");
//         var secp = require('tiny-secp256k1');
//         var ecfacory = require('ecpair');
//         var ECPair = ecfacory.ECPairFactory(secp);
//         const keyBuffer = Buffer.from(wif, 'hex')
//         var keys = ECPair.fromPrivateKey(keyBuffer)
//         var newtx = {
//             inputs: [{ addresses: [from] }],
//             outputs: [{ addresses: [to], value: amount - response.data.feerate * 1e8 }]
//         };
//         // calling the new endpoint, same as above
//        await axios.post(`${BITCOIN_NODE_URI}/txs/new`, JSON.stringify(newtx))
//             .then(async function (tmptx) {
//                 // signing each of the hex-encoded string required to finalize the transaction
//                 tmptx.data.pubkeys = [];
//                 tmptx.data.signatures = tmptx.data.tosign.map(function (tosign, n) {
//                     tmptx.data.pubkeys.push(keys.publicKey.toString('hex'));
//                     return bitcoin.script.signature.encode(
//                         keys.sign(Buffer.from(tosign, "hex")),
//                         0x01,
//                     ).toString("hex").slice(0, -2);
//                 });
//                 console.log("tmptx.data", tmptx.data)
//                 await axios.post(`${BITCOIN_NODE_URI}/txs/send`, JSON.stringify(tmptx.data))

//             })
//         return
//     }
//     catch (e) {
//         console.log("reee",e)
//         throw "fail to transfer bitcoin"
//     }
//}

module.exports = transferBtcScript





