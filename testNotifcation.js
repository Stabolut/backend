// Importing required modules
var admin = require("firebase-admin");
const walletModel = require("./models/walletModel");
// Importing Firebase service account key file
var serviceAccount = require("./firebaseConfig.json");


// Initializing Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

/**
 * Function to send a notification to a user device
 * @param {string} userToken - The device token of the user
 * @param {string} body - The body of the notification
 * @param {string} title - The title of the notification
 * @param {string} subtitle - The subtitle of the notification (optional)
 * @param {object} metaData - Additional metadata associated with the notification
 */
const sendNotificationService = (userToken, body, title, subtitle = "", metaData) => {
    try {
     
        // Sending notification using Firebase Admin SDK
        const message = {
            token: userToken,
            notification: {
                body: body,
                title: title,

            },
            android: {
                notification: {
                    body: body,
                    title: title,
                    color: "#788595",
                    priority: "high",
                    sound: "default",
                    icon: "ic_notification",
                    vibrateTimingsMillis: [200, 500, 800],

                },
            },
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: title,
                            body: body,
                        },
                    },
                },
            },
        };

        admin.messaging().send(message)
            .then((response) => {
                console.log("Successfully sent message:", response);
            })
            .catch((error) => {
                console.error("Error sending message:", error);
                // Handling token expiration error
                if (error.code === "messaging/invalid-registration-token" || error.code === "messaging/registration-token-not-registered") {
                    console.log("Token is expired or invalid:", userToken);
                    // Updating the user's token array in the database to remove the expired token
                    walletModel.updateOne(
                        { account: metaData.address },
                        { $pull: { tokenArray: { token: userToken } } }
                    ).catch((e) => {
                        console.error("Error updating token:", e);
                    });
                }
            });
    } catch (e) {
        console.error("Error in notification service:", e);
        // Error handling for notification service failure
    }

  
};

sendNotificationService(
    "egQP_VkRQcqHDbk8zthdXV:APA91bFvlVRUzEunB5wUzqXc4_6R5QyYBh2qCr2OiLpCQZRtl5dYslSynYqay3tFio3s3UpfEvR-ErLeqHL4vOqXslsMVOy7Y-wxr1ypjdgXS2Iv_wJafxA", // The Firebase device token from the wallet or request
    "You’ve received 10 US₿!", // Body
    "Transaction Successful",  // Title
    "Wallet Update",           // (Optional) Subtitle
    { address: "0x79bfaEACfEF29735C929657869EF38A2b7104337" } // Metadata (used for token cleanup)
);
