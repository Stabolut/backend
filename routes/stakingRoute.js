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

router.post(
  route.ADD_IN_STAKE,
  addInStakeValidation(),
  validateRequest,
  httpErrorHandler(addInStake)
);
router.post(
  route.GET_IN_STAKE,
  getInStakeValidation(),
  validateRequest,
  httpErrorHandler(getInStake)
);

router.post(
  route.STAKE_TRANSACTION,
  stakeWalletValidations(),
  validateRequest,
  httpErrorHandler(stakeTransactions)
);

router.post(
  route.STAKE_REWARD,
  stakeWalletValidations(),
  validateRequest,
  httpErrorHandler(stakeReward)
);

module.exports = router;
