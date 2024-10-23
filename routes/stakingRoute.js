const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const {
  addInStake,
  getInStake,
  stakeTransactions,
  stakeReward,
} = require("../controller/staking");

const {
  addInStakeValidation,
  getInStakeValidation,
  stakeWalletValidations,
} = require("../validation/stakeValidation");
const { validateRequest } = require("../middlewares/validateRequest");
const route = require("./route");

/**
 * @swagger
 * /api/v1/staking/add-in-stake:
 *   post:
 *     summary: Add tokens to stake
 *     tags: [Staking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stake'
 *     responses:
 *       200:
 *         description: Tokens staked successfully
 *       400:
 *         description: Invalid input
 */

router.post(
  route.ADD_IN_STAKE,
  addInStakeValidation(),
  validateRequest,
  httpErrorHandler(addInStake)
);

/**
 * @swagger
 * /api/v1/staking/get-in-stake:
 *   post:
 *     summary: Get staking information
 *     tags: [Staking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Staking information retrieved
 */

router.post(
  route.GET_IN_STAKE,
  getInStakeValidation(),
  validateRequest,
  httpErrorHandler(getInStake)
);

/**
 * @swagger
 * /api/v1/staking/stake-transaction:
 *   post:
 *     summary: Get stake transactions
 *     tags: [Staking]
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
 *         description: Stake transactions retrieved successfully
 *       400:
 *         description: Invalid input
 */

router.post(
  route.STAKE_TRANSACTION,
  stakeWalletValidations(),
  validateRequest,
  httpErrorHandler(stakeTransactions)
);

/**
 * @swagger
 * /api/v1/staking/stake-reward:
 *   post:
 *     summary: Get stake rewards
 *     tags: [Staking]
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
 *         description: Stake rewards retrieved successfully
 *       400:
 *         description: Invalid input
 */

router.post(
  route.STAKE_REWARD,
  stakeWalletValidations(),
  validateRequest,
  httpErrorHandler(stakeReward)
);

module.exports = router;
