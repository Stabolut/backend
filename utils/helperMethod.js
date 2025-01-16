const axios = require("axios")
const { BITCOIN_TOKEN, SECRET_KEY, BITCOIN_NODE_URI, STAKE_REWRD_PERCENT } = require("../config")
var CryptoJS = require("crypto-js");
console.log("uri", `${BITCOIN_NODE_URI}?token=${BITCOIN_TOKEN}`)


createAndEncryptWallet = async () => {

  try {
    let { data } = await axios.post(`${BITCOIN_NODE_URI}/addrs?token=${BITCOIN_TOKEN}`)

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

function generateReferralCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 8;
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));

  }
  return code;
}
function generateReferralLink(referralCode) {
  return `https://yourapp.com/signup?ref=${referralCode}`
}
stakeRewardCalculation = (amount) => {
  console.log("amount ccccc",amount,STAKE_REWRD_PERCENT,(amount * STAKE_REWRD_PERCENT) / 100)
  return (amount * STAKE_REWRD_PERCENT) / 100; // Calculate yield
}





module.exports = {
  createAndEncryptWallet,
  decryptWallet,
  generateOTP,
  generateReferralCode,
  generateReferralLink,
  stakeRewardCalculation

}



