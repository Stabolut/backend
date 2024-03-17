// Importing required modules
var admin = require("firebase-admin");
const WalletModel = require("./models/WalletModel");
// Importing Firebase service account key file
var serviceAccount = require("./eurb-3a677-firebase-adminsdk-mzrqh-52b1120d3f.json");

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
const sendNotification = (userToken, body, title, subtitle = "", metaData) => {
  try {
    // Sending notification using Firebase Admin SDK
    admin
      .messaging()
      .send({
        token: userToken,
        data: {
          customData: "",
          id: "1",
          ad: "",
          subTitle: subtitle,
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
      })
      .then((msg) => {
        console.log(msg);
      })
      .catch(async (err) => {
        // Handling token expiration error
        if (err.message === "Requested entity was not found.") {
          console.log("Token is expired", userToken);
          // Updating the user's token array in the database to remove the expired token
          try {
            await WalletModel.updateOne(
              { account: metaData.address },
              { $pull: { tokenArray: { token: userToken } } }
            );
          } catch (e) {
            // Error handling for database update failure
          }
        }
      });
  } catch (e) {
    console.log("Error in notification service", e);
    // Error handling for notification service failure
  }
};

// Exporting the sendNotification function for use in other parts of the application
module.exports = {
  sendNotification,
};
