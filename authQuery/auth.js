
const UserModel = require("../models/UserModel")
const UserModelUSB = require("../models/UserModelUSB")

getInformationByUniqueId = async (userKey, value, modelName) => {
    try {

        const user = await modelName.findOne({ [userKey]: value });
        return user

    } catch (err) {
        throw err
    }
}

getUserByUsernameAndPassword = async (username, password) => {
    try {

        const user = await UserModelUSB.findOne({ username: username, password: password });

        return user

    } catch (err) {
        throw err
    }
}



fetchUserAgainstToken = async (id) => {
    try {

        const user = await
            UserModelUSB.findOne({ _id: id }).select("username")

        return user

    } catch (err) {
        throw err
    }
}


module.exports = {
    getInformationByUniqueId,
    getUserByUsernameAndPassword,
    fetchUserAgainstToken

}