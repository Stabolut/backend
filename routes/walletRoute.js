const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const {
  createWallet,
  addWallet,
  transferTokens,
} = require("../controller/wallet");

const {
  addWalletValidation,
  transferTokenValidation,
  walletAddressValidation,
  transactionStatusUpdateStatus,
} = require("../validation/walletRouteValidation");
const { validateRequest } = require("../middlewares/validateRequest");
const route = require("./route");

router.get(route.CREATE, httpErrorHandler(createWallet));
router.post(
  route.ADD_WALLET,
  addWalletValidation(),
  validateRequest,
  httpErrorHandler(addWallet)
);

router.post(
  route.TOKEN_TRANSFER,
  transferTokenValidation(),
  validateRequest,
  httpErrorHandler(transferTokens)
);

router.post(
  route.TRANSACTIONS_LIST,
  walletAddressValidation(),
  validateRequest,
  httpErrorHandler(transactionsList)
);

router.post(
  route.TRANSACTIONS_LIST_WITH_LIMIT,
  walletAddressValidation(),
  validateRequest,
  httpErrorHandler(transactionsListWithLimit)
);

router.post(
  route.UPDATE_TRANSACTION_STATUS,
  transactionStatusUpdateStatus(),
  validateRequest,
  httpErrorHandler(updateTransactionStatus)
);

module.exports = router;
