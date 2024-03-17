const WalletModel = require("../models/WalletModel");
const { mint } = require("../utils/wallet");
const AutomateStakeModel = require("../models/AutomateStakeModel");
const { CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY } = require("../config");
const {
  isValidEthereumAddress,
  getGasPrice,
  getNonce,
  signAndSendTransaction,
  transferPreSignedHex,
} = require("../utils/wallet");

const runTask = async () => {
  try {
    const stakeRewardList = await AutomateStakeModel.find({
      $or: [{ isRewardTransfer: false }, { isRewardTransferSuccess: "Fail" }],
    });

    if (stakeRewardList.length > 0) {
      for (var i = 0; i < stakeRewardList.length; i++) {
        try {
          //If user current balance is
          await AutomateStakeModel.updateOne(
            { _id: stakeRewardList[i]._id },
            {
              $set: {
                isRewardTransfer: true,
              },
            }
          );
          let encoded_tx = await mint(
            stakeRewardList[i].wallet,
            parseInt(stakeRewardList[i].rewardAmount) * 1e2
          );

          const gasPrice = (await getGasPrice()) * 2;
          const nonce = await getNonce(FUNDING_ADDRESS);

          let estimateTransactionObject = {
            nonce: global.web3.utils.toHex(nonce),
            from: FUNDING_ADDRESS,
            gasPrice: global.web3.utils.toHex(gasPrice),
            to: CONTRACT_ADDRESS,
            data: encoded_tx,
          };

          const gasLimit = await web3.eth.estimateGas(
            estimateTransactionObject
          );

          let transactionObject = {
            nonce: global.web3.utils.toHex(nonce),
            from: FUNDING_ADDRESS,
            gasPrice: global.web3.utils.toHex(gasPrice),
            gasLimit: global.web3.utils.toHex(gasLimit),
            to: CONTRACT_ADDRESS,
            data: encoded_tx,
            // chainId: global.web3.utils.toHex(80001),
          };
          const hash = await signAndSendTransaction(
            transactionObject,
            FUNDING_KEY
          );
          await AutomateStakeModel.updateOne(
            { _id: stakeRewardList[i]._id },
            {
              $set: {
                hash: hash.transactionHash,
              },
            }
          );
        } catch (e) {
          console.log("inside catch", e);
          try {
            await AutomateStakeModel.updateOne(
              { _id: stakeRewardList[i]._id },
              {
                $set: {
                  isRewardTransfer: false,
                  isRewardTransferSuccess: "Fail",
                },
              }
            );
          } catch (e) {}
        }
      }
      console.log("service complete");
    } else {
      console.log("no reward found");
    }
  } catch (e) {
    console.log("inside this", e);
  }
};

const stakingRewardService = () => {
  const initialDelay = 0.15 * 60 * 1000; // Initial delay in milliseconds (2 minutes)
  const interval = 60 * 60 * 1000; // 1 hour in milliseconds
  // Function to run the service periodically
  const runService = () => {
    runTask();
  };
  // Schedule the service to run after initial delay and repeat at interval
  setTimeout(() => {
    runService(); // Run the initial task after 2 minutes
    setInterval(runService, interval); // Run the task every 1 hour after the initial run
  }, initialDelay);
};

module.exports = { stakingRewardService };
