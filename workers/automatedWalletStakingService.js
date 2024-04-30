const walletModel = require("../models/walletModel");
const { getTokenBalance } = require("../utils/wallet");
const automateStakeModel = require("../models/automateStakeModel");
const axios = require("axios");

const runTask = async () => {
   
  // Your task to be executed every 1 minute
  // get user wallet
  try {
    let percentage = 0.0008 * 3;

    try {
      let { data } = await axios.get(
        "https://www.bitmex.com/api/v1/funding?symbol=ETHUSD&count=1&reverse=true"
      );

      if (data.length > 0) {
        percentage = data[0].fundingRateDaily * 3;
      }
    } catch (e) { }

    const walletList = await walletModel.find({});

    if (walletList.length > 0) {
      for (var i = 0; i < walletList.length; i++) {
        let balance = await getTokenBalance(walletList[i].account);

        //If user current balance is
        if (walletList[i].balance >= parseFloat(balance / 1e2)) {
          const stake = new automateStakeModel({
            wallet: walletList[i].account,
            stakeAmount: walletList[i].balance,
            rewardPercentage,
            percentage,
            rewardAmount: (walletList[i].balance * percentage) / 100,
          });
          await stake.save();
          await walletModel.updateOne(
            { _id: walletList[i]._id },
            {
              $set: {
                balance: parseFloat(balance / 1e2),
              },
            }
          );
        
        } else {
         
        }
      }
    } else {
    
    }
  } catch (e) {
    console.log("there is some issue in stake service", e);
  }
};

const automatedWalletStakingService = () => {
  const now = new Date();
  const targetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  ); // Set the target time to midnight
  // Check if the target time is in the past, and if so, add 24 hours
  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }
  const initialDelay = targetTime - now; // Calculate the initial delay until midnight
  const interval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // const initialDelay = 0.15 * 60 * 1000; // Initial delay in milliseconds (2 minutes)
  // const interval = 60 * 1000; // 1 minute in milliseconds

  const runService = () => {
    runTask();
  };

  setTimeout(() => {
    runService(); // Run the initial task after 2 minutes
    setInterval(runService, interval); // Run the task every 1 minute after the initial run
  }, initialDelay);
};

module.exports = { automatedWalletStakingService };
