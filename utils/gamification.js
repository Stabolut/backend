
const constant = require("../constants/constant");
const walletModel = require("../models/walletModel")
const transactionModel = require("../models/transactionModel");
const { sendNotificationService } = require("../workers/sendNotificationService");

awardPoint = async (senderAddress) => {
    try {
        const wallet = await walletModel.findOne({ account: senderAddress });

        if (wallet) {
            wallet.points += constant.constant.points.transferPoint; // Add points
            // await wallet.save();
            const transferCount = await transactionModel.countDocuments({ senderAddress: senderAddress, transactionType: "Transfer" });
            if (transferCount === 1 && !wallet.badges.some(badge => badge.title === "First Transfer")) {
                wallet.badges.push({ title: "First Transfer" });
                await wallet.save();

                try {
                    let token = await walletModel.findOne({ account: senderAddress });

                    if (token) {
                        let receiveTokenArray = token.tokenArray;
                        for (var i = 0; i < receiveTokenArray.length; i++) {
                            try {
                                console.log("token", receiveTokenArray[i].token);
                                if (receiveTokenArray[i].token) {
                                    await sendNotificationService(
                                        receiveTokenArray[i].token,
                                        `You've earned the First Transfer badge and 10 tokens!`,
                                        'Congratulations! 🎉',


                                    );
                                }
                            } catch (error) {
                                console.error(`Error sending notification for token ${i}:`, error);
                                // Continue to the next iteration even if an error occurs
                                continue;
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error finding wallet:", e);
                }
                console.log(`Awarded "First Transfer" badge to ${wallet.account}`);
            }
            if (transferCount >= 10 && transferCount < 50 && !wallet.badges.some(badge => badge.title === "Frequent Sender")) {
                wallet.badges.push({ title: "Frequent Sender" });
                await wallet.save();

                try {
                    let token = await walletModel.findOne({ account: senderAddress });

                    if (token) {
                        let receiveTokenArray = token.tokenArray;
                        for (var i = 0; i < receiveTokenArray.length; i++) {
                            try {
                                console.log("token", receiveTokenArray[i].token);
                                if (receiveTokenArray[i].token) {
                                    await sendNotificationService(
                                        receiveTokenArray[i].token,
                                        `You've earned the Frequent Sender badge and 50 tokens!`,
                                        'Congratulations! 🎉',


                                    );
                                }
                            } catch (error) {
                                console.error(`Error sending notification for token ${i}:`, error);
                                // Continue to the next iteration even if an error occurs
                                continue;
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error finding wallet:", e);
                }
                console.log(`Awarded "Frequent Sender" badge to ${wallet.account}`);
            }
            else if (transferCount >= 100 && !wallet.badges.some(badge => badge.title === "Power User")) {
                wallet.badges.push({ title: "Power User" });
                await wallet.save();

                try {
                    let token = await walletModel.findOne({ account: senderAddress });

                    if (token) {
                        let receiveTokenArray = token.tokenArray;
                        for (var i = 0; i < receiveTokenArray.length; i++) {
                            try {
                                console.log("token", receiveTokenArray[i].token);
                                if (receiveTokenArray[i].token) {
                                    await sendNotificationService(
                                        receiveTokenArray[i].token,
                                        `You've earned the Power User badge and 100 tokens!`,
                                        'Congratulations! 🎉',


                                    );
                                }
                            } catch (error) {
                                console.error(`Error sending notification for token ${i}:`, error);
                                // Continue to the next iteration even if an error occurs
                                continue;
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error finding wallet:", e);
                }

                console.log(`Awarded "Frequent Sender" badge to ${wallet.account}`);
            }
        }
    }
    catch (e) {
        console.log("catch", e)

    }

}
module.exports = {
    awardPoint
}

