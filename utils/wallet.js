
const { CONTRACT_ADDRESS, ABI, FEE } = require('../config')

const privateKeyToAddress = require('ethereum-private-key-to-address')

var Tx = require('ethereumjs-tx');
const ethUtil = require("ethereumjs-util");





const isValidEthereumAddress = (address) => {
        try {

                global.web3.utils.toChecksumAddress(address)
                return true;

        } catch (e) {
                return false;
        }
}

const isValidEthereumPrivateKey = (key) => {
        try {

                if (!key.startsWith('0x')) {
                        key = '0x' + key;
                }
                const bufferedKey = ethUtil.toBuffer(key);
                if (ethUtil.isValidPrivate(bufferedKey)) return true;
                else false

        } catch (e) {
                return false;
        }
}
const getNativeBalance = async (address) => {
        try {

                const balance = await global.web3.eth.getBalance(address);
                const weiBalance = global.web3.utils.fromWei(balance, "ether");
                return weiBalance;

        } catch (e) {
                return 0;
        }
}

const getTokenBalance = async (address) => {
        try {
                const contract = await new global.web3.eth.Contract(ABI, CONTRACT_ADDRESS);

                const balance = await contract.methods.balanceOf(address).call();
                return balance;

        } catch (e) {
                return 0;
        }
}

const getTransferPreSignedHash = async (to, value, nonce) => {
        try {
                const contract = await new global.web3.eth.Contract(ABI, CONTRACT_ADDRESS);
                const hash = await contract.methods.getTransferPreSignedHash(CONTRACT_ADDRESS, to, value, FEE, nonce).call();
                return hash;

        } catch (e) {
                return e.message;
        }
}

const transferPreSignedHex = async (signature, to, value, nonce) => {
        try {
                const contract = await new global.web3.eth.Contract(ABI, CONTRACT_ADDRESS);
                const tx_builder = await contract.methods.transferPreSigned(signature, to, value, FEE, nonce);
                const encoded_tx = tx_builder.encodeABI();
                return encoded_tx;

        } catch (e) {
                return e.message;
        }
}

const mint = async (to, value) => {
       
        try {
                const contract = await new global.web3.eth.Contract(ABI, CONTRACT_ADDRESS);
                const tx_builder = await contract.methods.mint(to, value);
                const encoded_tx = tx_builder.encodeABI();
                return encoded_tx;

        } catch (e) {
                console.log("message", e)
                throw e.message;
        }
}

const getSignature = async (account, hash) => {
        try {
                const signature = await global.web3.eth.sign(account, hash);
                return signature;

        } catch (e) {
                return e.message;
        }
}

const getNonce = async (account) => {
        try {
                const count = await global.web3.eth.getTransactionCount(account);
                return count;

        } catch (e) {
                return e.message;
        }
}

const getGasPrice = async () => {
        try {
                const gas = await global.web3.eth.getGasPrice();
                return gas;

        } catch (e) {
                return e.message;
        }
}

const createWallet = async () => {
        try {
                const wallet = await global.account.create();
                return wallet;

        } catch (e) {
                return e.message;
        }
}

const importWallet = async (key) => {
        try {
                if (isValidEthereumPrivateKey(key)) {
                        const wallet = await privateKeyToAddress(key);
                        return wallet;
                } else { return "invalid private key" }

        } catch (e) {
                return e.message;
        }
}

const signAndSendTransaction = async (rawTx, privateKey) => {
        // console.log("I reached theree")
        try {
                var privateKey = Buffer.from(privateKey, 'hex');

                var tx = new Tx(rawTx);
                tx.sign(privateKey);
                var serializedTx = tx.serialize();
                const hash = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                //console.log("Return hash ",hash)
                return hash
        } catch (e) {
                console.log("Errr", e, e.message)
                throw { message: e.message }
                //return e
        }
}

const signAndSendTransactionOnPurchase = async (rawTx, privateKey) => {

        try {
                var privateKey = Buffer.from(privateKey, "hex");

                var tx = new Tx(rawTx);
                tx.sign(privateKey);
                var serializedTx = tx.serialize();
                const hash = await web3.eth.sendSignedTransaction(
                        "0x" + serializedTx.toString("hex")
                );

                return { status: true, hash };
        } catch (e) {
                console.log("Errr in signed transaction", e, e.message);
                return { statu: false }

        }
};



module.exports = {
        isValidEthereumAddress,
        createWallet,
        getNonce,
        getSignature,
        getTokenBalance,
        getTransferPreSignedHash,
        getNativeBalance,
        importWallet,
        isValidEthereumPrivateKey,
        signAndSendTransaction,
        transferPreSignedHex,
        getGasPrice,
        mint,
        signAndSendTransactionOnPurchase
}

