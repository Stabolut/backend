const cron = require("node-cron");
const { default: axios } = require("axios");
const APRModel = require("../../models/APRModel");

const runTask = async () => {
    try {
        let { data } = await axios.get(process.env.bitmexUrl)
        let rate = new APRModel({ fundingRateDaily: data[0].fundingRateDaily})
        await rate.save()
    } catch (e) {
    }
};

const APRRateService = async () => {
    await runTask(); // Run the task immediately at service start
    cron.schedule("0 */8 * * *", async () => { // Scheduling the task to run at 0 minutes and then every 8 hours
        try {
            console.log("service start")
            await runTask()
        }
        catch (e) {

        }
    })
};
module.exports = { APRRateService };
