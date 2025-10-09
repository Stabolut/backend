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
  freeUSBLimit: 5,
  contractInternalTransactionAddress: "0x0000000000000000000000000000000000000000",
  referralRewardAmount: 5,
  network: {
    XDC: "XDC",
    Arbitrium: "Arbitrium"
  },
  // airdrop: 0.001//0.1%
  airdrop: 0.001,//0.1%

  points: {
    transferPoint: 10

  }
};

module.exports = {
  constant: constant,
};
