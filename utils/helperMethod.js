const axios = require("axios")
const { BITCOIN_TOKEN, SECRET_KEY, BITCOIN_NODE_URI } = require("../config")
var CryptoJS = require("crypto-js");
console.log("uri", `${BITCOIN_NODE_URI}?token=${BITCOIN_TOKEN}`)


createAndEncryptWallet = async () => {

  try {
    let { data } = await axios.post(`${BITCOIN_NODE_URI}/addrs?token=${BITCOIN_TOKEN}`)
    console.log("wallet", data)
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return ciphertext
  }
  catch (e) {
    console.log("wallet creation error", e)
    throw { message: "Fail to create bitcoin wallet" }

  }
}


decryptWallet = async (ciphertext) => {
  try {

    var bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData
  }
  catch (e) {
    console.log("wallet decryption", e)
    throw MESSAGES.ERROR_MESSAGE.GENERAL_ERROR_MESSAGE

  }
}

function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// Example usage
const OTP = generateOTP();
console.log(OTP);


module.exports = {
  createAndEncryptWallet,
  decryptWallet,
  generateOTP

}



