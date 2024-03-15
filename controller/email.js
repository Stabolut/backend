const emailUtility = require("../utils/emailUtility")
const config = require("../config")
const SubscribeModel = require("../models/SubscribeUserMode")
const { errorResponse, routeResponseOnlyMessage, routeResponseWithData } = require("../utils/responses")

contactUsEmail = async (req, res) => {
    let subject = ""
    if (req?.body?.subject) {
        subject = " - " + req?.body?.subject


    }


    try {
        emailUtility.transporter.sendMail(emailUtility.mailOptions(config.RECEIPENT, config.SUBJECT + subject, config.emailForAdminContact(req.body.name, req.body.email, req.body.message, req.body.phone)), async (error, info) => {
            if (error) {
                console.log("Error is", error)

                return res.status(400).send({
                    success: true,
                    message: "unexpected error occured, please try again"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Contact email send successfully "

                });
            }
        });
    }
    catch (e) {
        console.log("Eerrir is", e)
        return res.status(500).send({
            success: true,
            message: "unexpected error occured, please try again"
        });

    }

}



subscribedEmail = async (req, res) => {
    
    try {
        const existingUser = await SubscribeModel.findOne({ email: req.body.email });

        if (existingUser) {
            return errorResponse(res, "It appears that you have already subscribed. Thank you for joining!", 400)

        } else {
            // Wallet document with the given account does not exist, so create it.
            const newSubscribe = new SubscribeModel({ email: req.body.email, name: req.body.name, companyName: req.body.cname });
            newSubscribe.save();
            return routeResponseOnlyMessage(res, true, "Your subscription has been successfully saved. Thank you for subscribing!")
        }
    }
    catch (e) {
        console.log("Eerrir is", e)
        return errorResponse(res, "There seem to be some problems with subscribing users at the moment. Please try again at a later time.", 500)


    }

}

module.exports = {
    contactUsEmail,
    subscribedEmail

}