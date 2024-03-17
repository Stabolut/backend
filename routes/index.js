const router = require("express").Router();
const purchasePanelRoute = require("./purchasePanelRoute");

router.use("/purchase", purchasePanelRoute);

module.exports = router;
