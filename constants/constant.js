const constant = {


  /**
   * API configs
   */
  api: {
    prefix: "/api/v1/stabolut",
  },
  btcToUsdRate: 66000,
  ethToUsdRate: 3300,
  currencyType: {
    eth: "eth",
    btc: "btc"
  },
  transferStatus: {
    Processing: "Processing",
    Pending: "Pending",
    Success: "Success"
  },
  freeUSBLimit: 50,
  contractInternalTransactionAddress:"0x0000000000000000000000000000000000000000",
  referralRewardAmount:20
};

module.exports = {
  constant: constant,
};
