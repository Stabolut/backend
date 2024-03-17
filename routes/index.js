const router = require("express").Router();
const purchasePanelRoute = require("./purchasePanelRoute");
const walletRoute = require("./walletRoute");
const userRoute = require("./userRoute");
const stakingRoute = require("./stakingRoute");
const generalRoute = require("./generalRoute");

router.use("/purchase", purchasePanelRoute);
router.use("/wallet", walletRoute);
router.use("/user", userRoute);
router.use("/staking", stakingRoute);
router.use("/general", generalRoute);

module.exports = router;
