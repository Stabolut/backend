var admin = require("firebase-admin");
const WalletModel = require("./models/WalletModel")
var serviceAccount = require("./eurb-3a677-firebase-adminsdk-mzrqh-52b1120d3f.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const sendNotification = (userToken, body, title, subtitle = "", metaData) => {
   
    try {
        admin.messaging().send({
            token: userToken,
            data: {
                customData: "",
                id: "1",
                ad: "",
                subTitle: subtitle
            },
            android: {
                notification: {
                    body: body,
                    title: title,
                    color: "#788595",
                    priority: "high",
                    sound: "default",
                    vibrateTimingsMillis: [200, 500, 800]
                    //imageUrl: "https://images.unsplash.com/photo-1516475429286-465d815a0df7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"

                }
            }
        }).then((msg) => {
            console.log(msg)
        }).catch(async (err) => {

            if (err.message === "Requested entity was not found.") {
                console.log("Token is expired", userToken)
                try {
                    await WalletModel.updateOne(
                        { account: metaData.address },
                        { $pull: { tokenArray: { token: userToken } } }
                    );
                }
                catch (e) {
                }
            }
        })
    } catch (e) {
        console.log("Error in notification service", e)
        // throw false;
    }
}

module.exports = {
    sendNotification

}

// body: "Nodejsden Gelen Bildirim 😊",
// title: "title 😊",