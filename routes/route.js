module.exports = {
  //Purchase Route
  GET_ADMIN_DEPOSIT_ADDRESS: "/get-admin-deposit-address",
  PURCHASE_USB_WITH_ETH: "/purchase-usb-with-eth",
  PURCHASE_USB_WITH_BTC: "/purchase-usb-with-btc",
  CHECK_USER_WALLET_EXISTANCE:"/check-user-wallet-existence",
  //Wallet Route
  CREATE: "/create",
  ADD_WALLET: "/add-wallet",
  TOKEN_TRANSFER: "/transfer-token",
  TRANSACTIONS_LIST: "/transacions-list",
  TRANSACTIONS_LIST_WITH_LIMIT: "/transacions-list-with-limit",
  UPDATE_TRANSACTION_STATUS: "/update-transaction-status",
  MINT_COIN:"/mint-coin",
  GET_FREE_COIN:"/get-free-coin",
  //User Route
  RETRIEVE_USER_BY_WALLET_ADDRESS_OR_USERNAME:
    "/retrieve-user-by-wallet-or-username",
  ASSIGN_USERNAME_TO_WALLET: "/assign-username-to-wallet",
  ADD_CONTACT_LIST: "/add-contact-list",
  GET_CONTACT_LIST: "/get-contact-list",
  // Staking Route
  ADD_IN_STAKE: "/add-in-stake",
  GET_IN_STAKE: "/get-in-stake",
  STAKE_TRANSACTION: "/stake-transaction",
  STAKE_REWARD: "/stake-reward",
  // general Route
  CONTACT_US_EMAL: "/contact-us-email",
  SUBSCRIBE: "/subscribe",
};
