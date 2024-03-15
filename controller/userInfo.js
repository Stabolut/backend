
const { routeResponseWithData, errorResponse, routeResponseOnlyMessage } = require("../utils/responses")
const UserModel = require("../models/UserModel")
const { isValidEthereumAddress, getGasPrice, getNonce,
    signAndSendTransaction, transferPreSignedHex } = require('../utils/wallet');
const { ErrorMessages } = require("../constants/errors");
const ContactListModel = require("../models/ContactList");
const { InfoMessages } = require("../constants/messages");


addUsername = async (req, res) => {
    try {

        const existingUser = await UserModel.findOne({ account: req.body.account });

        if (existingUser) {

            res.status(404).json({
                message: `Username already exist against this account which is ${existingUser.username}`
            })

        } else {
            // Wallet document with the given account does not exist, so create it.
            const newUser = new UserModel({ account: req.body.account, username: req.body.username });
            newUser.save();
            return res.status(200).send("Account associate with username")
        }

    } catch (err) {
        console.log("ccc", err)
        res.status(500).json({
            message: err.message
        })
    }
}

addContactListInfo = async (req, res) => {
    try {
        if (!isValidEthereumAddress(req.body.receiverAccount)) return errorResponse(res, "Receiver wallet address is invalid", 404)
        if (!isValidEthereumAddress(req.body.senderAccount)) return errorResponse(res, "Receiver wallet address is invalid", 404)

        const accountExist = await ContactListModel.findOne({ receiver_account: req.body.receiverAccount,sender_account:req.body.senderAccount });

        if (accountExist) {
            return errorResponse(res, `Account already exist against this name: ${accountExist.name}`, 404)

        }

        const newUser = new ContactListModel({ receiver_account: req.body.receiverAccount, sender_account: req.body.senderAccount, name: req.body.name });
        newUser.save();
        console.log("newUser", newUser)

        return routeResponseWithData(res, true, InfoMessages.GENERIC.ITEM_ADD_SUCCESSFULLY("Contact"), newUser, 200)

    } catch (err) {
        console.log("eeee", err)
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Add contact"), 404)
    }
}

getUserByAccount = async (req, res) => {
    try {


        const existingUser = await UserModel.findOne({ $or: [{ account: req.body.id }, { username: req.body.id }] });

        if (existingUser) {

            return res.status(200).send({ message: "User with this account found", data: existingUser, success: true })

        } else {
            // Wallet document with the given account does not exist, so create it.
            return res.status(200).send({ message: "No account found", data: existingUser })
        }

    } catch (err) {
        console.log("ccc", err)
        res.status(500).json({
            message: err.message
        })
    }
}


getContactListInfo = async (req, res) => {
    try {
        const contactList = await ContactListModel.find({ sender_account: req.body.account }).sort({ "timestamps.created_At": -1 });
        routeResponseWithData(res, true, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Contact info"), contactList, 200)

    } catch (err) {
        console.log("eeee", err)
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Get contact"), 404)
    }


}


module.exports = {
    addUsername,
    getUserByAccount,
    addContactListInfo,
    getContactListInfo

}