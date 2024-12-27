const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const {
  createWallet,
  addWallet,
  transactionsListWithLimit,
  transferTokens,
  updateTransactionStatus,
  mintCoin,
  transactionsList,
  getFreeCoin,
} = require("../controller/wallet");

const {
  addWalletValidation,
  transferTokenValidation,
  walletAddressValidation,
  transactionStatusUpdateStatus,
  coinMintValidation,
} = require("../validation/walletRouteValidation");
const { validateRequest } = require("../middlewares/validateRequest");
const route = require("./route");

/**
 * @swagger
 * /api/v1/create:
 *   get:
 *     summary: Create a new wallet
 *     tags: [Wallet]
 *     responses:
 *       200:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Wallet created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                       example: "0x1234..."
 *                     privateKey:
 *                       type: string
 *                       example: "0xabcd..."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get(route.CREATE, httpErrorHandler(createWallet));

/**
 * @swagger
 * /api/v1/add-wallet:
 *   post:
 *     summary: Add a wallet to the system
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: Address of the wallet to add
 *     responses:
 *       200:
 *         description: Wallet added successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  route.ADD_WALLET,
  addWalletValidation(),
  validateRequest,
  httpErrorHandler(addWallet)
);

/**
 * @swagger
 * /api/v1/transfer-token:
 *   post:
 *     summary: Transfer tokens between wallets
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - signature
 *               - toAddress
 *               - amount
 *               - nonce
 *               - senderAddress
 *             properties:
 *               signature:
 *                 type: string
 *                 description: Transaction signature
 *               toAddress:
 *                 type: string
 *                 description: Recipient wallet address
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *               nonce:
 *                 type: number
 *                 description: Transaction nonce
 *               senderAddress:
 *                 type: string
 *                 description: Sender wallet address
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Invalid input
 */
router.post(
  route.TOKEN_TRANSFER,
  transferTokenValidation(),
  validateRequest,
  httpErrorHandler(transferTokens)
);

/**
 * @swagger
 * /api/v1/wallet/transactions-list:
 *   post:
 *     summary: Get list of transactions
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *             properties:
 *               walletAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 */
router.post(
  route.TRANSACTIONS_LIST,
  walletAddressValidation(),
  validateRequest,
  httpErrorHandler(transactionsList)
);

/**
 * @swagger
 * /api/v1/wallet/transactions-list-with-limit:
 *   post:
 *     summary: Get paginated list of transactions
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *             properties:
 *               walletAddress:
 *                 type: string
 *               limit:
 *                 type: number
 *               page:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 */
router.post(
  route.TRANSACTIONS_LIST_WITH_LIMIT,
  walletAddressValidation(),
  validateRequest,
  httpErrorHandler(transactionsListWithLimit)
);

/**
 * @swagger
 * /api/v1/wallet/update-transaction-status:
 *   post:
 *     summary: Update transaction status
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - status
 *             properties:
 *               transactionId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *     responses:
 *       200:
 *         description: Transaction status updated successfully
 */
router.post(
  route.UPDATE_TRANSACTION_STATUS,
  transactionStatusUpdateStatus(),
  validateRequest,
  httpErrorHandler(updateTransactionStatus)
);

/**
 * @swagger
 * /api/v1/wallet/mint-coin:
 *   post:
 *     summary: Mint new coins
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *             properties:
 *               walletAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coins minted successfully
 */
router.post(
  route.MINT_COIN,
  walletAddressValidation(),
  validateRequest,
  httpErrorHandler(mintCoin)
);

/**
 * @swagger
 * /api/v1/wallet/get-free-coin:
 *   post:
 *     summary: Get free coins
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - amount
 *             properties:
 *               walletAddress:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Free coins received successfully
 *       400:
 *         description: Invalid request
 */
router.post(
  route.GET_FREE_COIN,
  coinMintValidation(),
  validateRequest,
  httpErrorHandler(getFreeCoin)
);

module.exports = router;
