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
  }
};

module.exports = {
  constant: constant,
};
