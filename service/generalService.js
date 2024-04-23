// Import required modules and models
const emailUtility = require("../utils/emailUtility");
const config = require("../config");
const subscribeModel = require("../models/subscribeUserMode");
const apiError = require("../error/apiError");

/**
 * Sends a contact email to the admin.
 * @param {object} req - The request object containing contact information.
 * @param {object} res - The response object.
 * @throws {ApiError} If an unexpected error occurs during email sending.
 * @returns {string} Confirmation message upon successful email sending.
 */
// Function to send contact user email
const contactUsEmail = async (req, res) => {
  let subject = "";
  if (req?.body?.subject) {
    subject = " - " + req?.body?.subject;
  }

  // Wrap the email sending logic in a promise
  return new Promise((resolve, reject) => {
    emailUtility.transporter.sendMail(
      emailUtility.mailOptions(
        config.RECEIPENT,
        config.SUBJECT + subject,
        config.emailForAdminContact(
          req.body.name,
          req.body.email,
          req.body.message,
          req.body.phone
        )
      ),
      async (error, info) => {
        if (error) {
          // Reject the promise with an error
          reject(
            new apiError("An unexpected error occurred. Please try again.", 400)
          );
        } else {
          // Resolve the promise with a success message
          resolve("Contact email sent successfully");
        }
      }
    );
  });
};

/**
 * Subscribes a user to receive updates via email.
 * @param {object} req - The request object containing subscription information.
 * @param {object} res - The response object.
 * @throws {ApiError} If the user is already subscribed.
 * @returns {string} Confirmation message upon successful subscription.
 */
const subscribedEmail = async (req, res) => {
  const existingUser = await subscribeModel.findOne({
    email: req.body.email,
  });

  if (existingUser) {
    throw new apiError("You have already subscribed. Thank you for joining!");
  } else {
    // Create a new subscription entry
    const newSubscribe = new subscribeModel({
      email: req.body.email,
      name: req.body.name,
      companyName: req.body.cname,
    });
    await newSubscribe.save();
    return "Your subscription has been successfully saved. Thank you for subscribing!";
  }
};

// Export the service functions for use in other parts of the application
module.exports = {
  contactUsEmail,
  subscribedEmail,
};
