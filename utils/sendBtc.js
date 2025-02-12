const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');
const axios = require('axios');

// 1. Testnet Configuration
const TESTNET = bitcoin.networks.testnet;
const ECPair = ECPairFactory(ecc);
const BLOCKSTREAM_API = 'https://blockstream.info/testnet/api';

// 2. Apna WIF Daalein (Testnet)
const WIF = 'cNngngffweGsYAt1Y2KncYi6xZsy1GW1yTh5Ar6USu8NFqMK2bz4';
const keyPair = ECPair.fromWIF(WIF, TESTNET);

// 3. P2WPKH Address Generate Karein
const { address } = bitcoin.payments.p2wpkh({
  pubkey: Buffer.from(keyPair.publicKey),
  network: TESTNET
});

// 4. BTC Send Function (Updated Fee Calculation)
 async function sendBTC(toAddress, amountSats) {
 // try {
    // UTXOs Fetch Karein
    const utxoResponse = await axios.get(`${BLOCKSTREAM_API}/address/${address}/utxo`);
    const utxos = utxoResponse.data;
    if (!utxos.length) throw new Error('Pehle testnet BTC prapt karein!');

    // PSBT Banayein
    const psbt = new bitcoin.Psbt({ network: TESTNET });
    let totalInput = 0;

    // Inputs Add Karein
    for (const utxo of utxos) {
      const txHex = await axios.get(`${BLOCKSTREAM_API}/tx/${utxo.txid}/hex`);
      psbt.addInput({
        hash: Buffer.from(utxo.txid, 'hex').reverse(),
        index: utxo.vout,
        witnessUtxo: {
          script: bitcoin.payments.p2wpkh({ pubkey: Buffer.from(keyPair.publicKey) }).output,
          value: utxo.value
        }
      });
      totalInput += utxo.value;
      if (totalInput > amountSats + 5000) break; // Adequate buffer
    }

    // Fee Calculate Karein (3 sat/vbyte)
    const feeRate = 3; // Testnet ke liye safe
    const estimatedVSize = (utxos.length * 68) + (2 * 31) + 10; // SegWit size formula
    const fee = estimatedVSize * feeRate;

    // Outputs Add Karein
    psbt.addOutput({ address: toAddress, value: amountSats });
    psbt.addOutput({ 
      address: address, 
      value: totalInput - amountSats - fee 
    });

    // Sign & Finalize
    psbt.signAllInputs(keyPair);
    psbt.finalizeAllInputs();

    // Broadcast Karein
    const txHex = psbt.extractTransaction().toHex();
    const { data: txid } = await axios.post(`${BLOCKSTREAM_API}/tx`, txHex);
    
    return txid;

//   } catch (error) {
//     throw new Error(`Error: ${error.message}`);
//   }
}


module.exports = {
    sendBTC
   
  };
  