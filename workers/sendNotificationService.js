// Importing required modules
var admin = require("firebase-admin");
const walletModel = require("../models/walletModel");
// Importing Firebase service account key file
var serviceAccount = require("../firebaseConfig.json");

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
                subtitle: subtitle,
            },
            android: {
                notification: {
                    body: body,
                    title: title,
                    color: "#788595",
                    priority: "high",
                    sound: "default",
                    vibrateTimingsMillis: [200, 500, 800],
                },
            },
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: title,
                            subtitle: subtitle,
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

module.exports = {
    sendNotificationService,
};
