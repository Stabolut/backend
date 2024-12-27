const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc,
  checkUserWalletExistence,
} = require("../controller/purcahsePanel");

const {
  getDepositAddressValidation,
  purchaseUSBValidation,
  checkWalletAddressValidation,
} = require("../validation/adminRouteValidation");

const { validateRequest } = require("../middlewares/validateRequest");
const route = require("./route");

/**
 * @swagger
 * /api/v1/purchase/get-admin-deposit-address:
 *   get:
 *     summary: Get admin deposit address
 *     tags: [Purchase]
 *     parameters:
 *       - in: query
 *         name: currencyType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [eth, btc]
 *     responses:
 *       200:
 *         description: Admin deposit address retrieved successfully
 *       400:
 *         description: Invalid currency type
 */

router.get(
  route.GET_ADMIN_DEPOSIT_ADDRESS,
  getDepositAddressValidation(),
  validateRequest,
  httpErrorHandler(getDepositAddress)
);

/**
 * @swagger
 * /api/v1/purchase/purchase-usb-with-eth:
 *   post:
 *     summary: Purchase USB tokens with ETH
 *     tags: [Purchase]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - amount
 *               - transactionHash
 *             properties:
 *               walletAddress:
 *                 type: string
 *               amount:
 *                 type: number
 *               transactionHash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purchase successful
 *       400:
 *         description: Invalid input
 */

router.post(
  route.PURCHASE_USB_WITH_ETH,
  purchaseUSBValidation(),
  validateRequest,
  httpErrorHandler(purchaseUSBWithEther)
);

/**
 * @swagger
 * /api/v1/purchase/purchase-usb-with-btc:
 *   post:
 *     summary: Purchase USB tokens with BTC
 *     tags: [Purchase]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - amount
 *               - transactionHash
 *             properties:
 *               walletAddress:
 *                 type: string
 *               amount:
 *                 type: number
 *               transactionHash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purchase successful
 *       400:
 *         description: Invalid input
 */

router.post(
  route.PURCHASE_USB_WITH_BTC,
  purchaseUSBValidation(),
  validateRequest,
  httpErrorHandler(purchaseUSBWithBtc)
);

/**
 * @swagger
 * /api/v1/purchase/check-user-wallet:
 *   post:
 *     summary: Check if user wallet exists
 *     tags: [Purchase]
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
 *         description: Wallet check successful
 *       400:
 *         description: Invalid input
 */

router.post(
  route.CHECK_USER_WALLET_EXISTANCE,
  checkWalletAddressValidation(),
  validateRequest,
  httpErrorHandler(checkUserWalletExistence)
);

module.exports = router;
