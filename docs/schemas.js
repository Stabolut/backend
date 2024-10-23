/**
 * @swagger
 * components:
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties:
 *         account:
 *           type: string
 *           description: Wallet address
 *         tokenArray:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *         balance:
 *           type: number
 *         referralCode:
 *           type: string
 *         referralLink:
 *           type: string
 *     Transaction:
 *       type: object
 *       properties:
 *         senderAddress:
 *           type: string
 *         receiverAddress:
 *           type: string
 *         amountToSend:
 *           type: number
 *         transactionHash:
 *           type: string
 *         transactionNotes:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         account:
 *           type: string
 *           description: Wallet address
 *         username:
 *           type: string
 *           description: User's username
 *     Purchase:
 *       type: object
 *       properties:
 *         usbSentAmount:
 *           type: number
 *         cryptoReceivedAmount:
 *           type: number
 *         conversionRate:
 *           type: number
 *         transferStatus:
 *           type: string
 *           default: "Pending"
 *         userUSBWalletAddres:
 *           type: string
 *         transactionHash:
 *           type: string
 *         transactionHashUSB:
 *           type: string
 *         type:
 *           type: string
 *     Stake:
 *       type: object
 *       properties:
 *         walletAddress:
 *           type: string
 *         amount:
 *           type: number
 *         duration:
 *           type: number
 *     ContactEmail:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         subject:
 *           type: string
 *         message:
 *           type: string
 *     Subscribe:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         companyName:
 *           type: string
 *     StakeTransaction:
 *       type: object
 *       properties:
 *         wallet:
 *           type: string
 *         yieldAmount:
 *           type: string
 *         amount:
 *           type: number
 *         hash:
 *           type: number
 *         timestamps:
 *           type: object
 *           properties:
 *             created_At:
 *               type: string
 *               format: date-time
 *             updated_At:
 *               type: string
 *               format: date-time
 *     USBUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: string
 *         fullName:
 *           type: string
 *         Verified:
 *           type: boolean
 *           default: true
 *         otp_token:
 *           type: number
 *         otp_create_time:
 *           type: string
 *           format: date-time
 *     Referral:
 *       type: object
 *       properties:
 *         refferalWallet:
 *           type: string
 *         referenceWallet:
 *           type: string
 *         isRewardTransfer:
 *           type: boolean
 *           default: false
 *         transactionHash:
 *           type: string
 *     ContactList:
 *       type: object
 *       properties:
 *         receiver_account:
 *           type: string
 *         sender_account:
 *           type: string
 *         name:
 *           type: string
 *     DepositAdmin:
 *       type: object
 *       properties:
 *         depositAddress:
 *           type: string
 *         isActive:
 *           type: boolean
 */
