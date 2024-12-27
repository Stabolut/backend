const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const { sendContactUserEmail, subscribe } = require("../controller/general");

const {
  contactUsValidation,
  subscribeValidation,
} = require("../validation/validation");
const { validateRequest } = require("../middlewares/validateRequest");
const route = require("./route");

/**
 * @swagger
 * /api/v1/general/contact-us-email:
 *   post:
 *     summary: Send contact email
 *     tags: [General]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactEmail'
 *     responses:
 *       200:
 *         description: Email sent successfully
 */

router.post(
  route.CONTACT_US_EMAL,
  contactUsValidation(),
  validateRequest,
  httpErrorHandler(sendContactUserEmail)
);

/**
 * @swagger
 * /api/v1/general/subscribe:
 *   post:
 *     summary: Subscribe to updates
 *     tags: [General]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscribe'
 *     responses:
 *       200:
 *         description: Subscription successful
 */

router.post(
  route.SUBSCRIBE,
  subscribeValidation(),
  validateRequest,
  httpErrorHandler(subscribe)
);

module.exports = router;
