const stakeModel = require("../models/stakeModel");
const APRModel = require("../models/APRModel");
const { stakeRewardCalculation } = require("../utils/helperMethod");

const runTask = async () => {

    try {
        const oneDayAgo = new Date(Date.now() - 3 * 60 * 1000); // 3 minutes ago //new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        const eligibleTransactions = await stakeModel.find({
            $or: [
                { lastRewardGiven_At: null, 'timestamps.created_At': { $lte: oneDayAgo } }, // First reward: created_At is 24+ hours ago
                { lastRewardGiven_At: { $lte: oneDayAgo } }, // Subsequent rewards: lastRewardGiven_At is 24+ hours ago
            ],
        });

        if (eligibleTransactions.length > 0) {

            let aprValue = await APRModel.findOne({}).sort({ 'timestamps.created_At': -1 });
            for (const transaction of eligibleTransactions) {
                //reward calculation
                let reward = stakeRewardCalculation(transaction.amount, aprValue.fundingRateDaily)
                // Update user wallet balance
                await stakeModel.updateOne(
                    { _id: transaction._id },
                    {
                        lastRewardGiven_At: new Date(),
                        $inc: { rewardAmountOnStaking: reward },
                    }
                );
            }
        }
    } catch (error) {
        console.error('Error updating withdrawable status:', error);
    }
};


const stakingRewardCalculations = () => {

    // const interval = 60 * 60 * 1000; // 1 hour in milliseconds
    const interval = 60 * 1000;
    // Function to run the service periodically
    const runService = () => {
        runTask();
    };
    // Schedule the service to run after initial delay and repeat at interval
    setTimeout(() => {
        runService(); // Run the initial task after 2 minutes
        setInterval(runService, interval); // Run the task every 1 hour after the initial run
    }, interval);
};

module.exports = { stakingRewardCalculations };
