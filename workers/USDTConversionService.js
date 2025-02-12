const cron = require("node-cron");
const { default: axios } = require("axios");
const { ETH_TO_USD_URL, BTC_TO_USD_URL } = require("../config")
const conversionRateModel = require("../models/ConversionRateModel")


const runTask = async () => {
    try {
        

        const response = await axios.get(ETH_TO_USD_URL);
        conversionApiResponse = await axios.get(BTC_TO_USD_URL);
        let usdtToBtc = conversionApiResponse.data.bitcoin.usd
        let usdtToEth = response.data.ethereum.usd;
        console.log("usdtToBtc", usdtToBtc, "usdtToEth", usdtToEth)


        await conversionRateModel.findOneAndUpdate(
            {}, // Find any existing record
            { ETH_TO_USD: usdtToEth, BTC_TO_USD: usdtToBtc }, // Update the field
            { upsert: true, new: true } // Create if not exists, return updated doc
        );
    } catch (e) {
        console.error("Error in runTask:", e);
    }
};

const USDTConversionService = async () => {
    await runTask(); // Run the task immediately at service start
    cron.schedule("0 * * * *", async () => { // Runs every hour at the start of the hour
        try {
            console.log("Service started: Running task every hour");
            await runTask();
        } catch (e) {
            console.error("Error in scheduled task:", e);
        }
    });
};

module.exports = { USDTConversionService };
