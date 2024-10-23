const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const {
  getUserByWalletOrUsername,
  assignUsernameToWallet,
  addContactList,
  getContactList,
} = require("../controller/user");

const {
  retrieveUserByWalletOrUsernameValidation,
  assingUsernameToWalletValidation,
  addContactListValidation,
  getContactListValidation,
} = require("../validation/userRouteValidation");
const { validateRequest } = require("../middlewares/validateRequest");
const route = require("./route");

/**
 * @swagger
 * /api/v1/user/retrieve-user:
 *   post:
 *     summary: Get user by wallet address or username
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Wallet address or username to search for
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  route.RETRIEVE_USER_BY_WALLET_ADDRESS_OR_USERNAME,
  retrieveUserByWalletOrUsernameValidation(),
  validateRequest,
  httpErrorHandler(getUserByWalletOrUsername)
);

/**
 * @swagger
 * /api/v1/user/assign-username-to-wallet:
 *   post:
 *     summary: Assign username to a wallet
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountID
 *               - username
 *             properties:
 *               accountID:
 *                 type: string
 *                 description: Wallet address
 *               username:
 *                 type: string
 *                 description: Desired username
 *     responses:
 *       200:
 *         description: Username assigned successfully
 *       400:
 *         description: Invalid input or username already taken
 */
router.post(
  route.ASSIGN_USERNAME_TO_WALLET,
  assingUsernameToWalletValidation(),
  validateRequest,
  httpErrorHandler(assignUsernameToWallet)
);

/**
 * @swagger
 * /api/v1/user/add-contact:
 *   post:
 *     summary: Add a contact to user's contact list
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userWalletAddress
 *               - contactWalletAddress
 *             properties:
 *               userWalletAddress:
 *                 type: string
 *                 description: User's wallet address
 *               contactWalletAddress:
 *                 type: string
 *                 description: Contact's wallet address to add
 *     responses:
 *       200:
 *         description: Contact added successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  route.ADD_CONTACT_LIST,
  addContactListValidation(),
  validateRequest,
  httpErrorHandler(addContactList)
);

/**
 * @swagger
 * /api/v1/user/get-contacts:
 *   post:
 *     summary: Get user's contact list
 *     tags: [User]
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
 *                 description: User's wallet address
 *     responses:
 *       200:
 *         description: Contact list retrieved successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  route.GET_CONTACT_LIST,
  getContactListValidation(),
  validateRequest,
  httpErrorHandler(getContactList)
);

module.exports = router;
