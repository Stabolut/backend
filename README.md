# Backend API for USB Token Management

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [High-Level Process](#high-level-process)
- [Contact](#contact-us)

## Overview

The Wallet Service Backend serves as the foundational infrastructure for a mobile wallet application tailored to manage USB, a specific cryptocurrency ecosystem. Designed with scalability and security in mind, this backend system facilitates a wide range of essential functionalities, including user wallet creation, fund transfers, staking, gasless transactions, transaction management, and integration with various blockchain networks.

Built on the robust Node.js runtime environment, complemented by the Express framework for seamless API development, and MongoDB for efficient data storage, this backend solution ensures high performance and reliability. Additionally, Firebase integration enables real-time transaction notifications, enhancing user engagement and experience.

With the provided API endpoints, developers can effortlessly integrate their mobile wallet applications with the backend system, allowing users to securely manage their USB digital assets, conduct gasless transactions, and stay updated on their wallet activities. The backend's flexibility also extends to supporting multiple cryptocurrencies, enabling users to transact with various digital currencies seamlessly.

Overall, the Wallet Service Backend empowers developers to create feature-rich mobile wallet applications specifically tailored for USB, providing users with a convenient, secure, and efficient platform for managing their USB cryptocurrency assets.


## Technologies Used

 - **Backend Framework:** Node.js with Express
 - **Database:** MongoDB
 - **Notification:** Firebase (for transaction notifications)
 - **Live Updates:** Socket.io

## Installation

To run the app locally, follow these steps:

1.   Clone the repository:

         git clone https://github.com/Stabolut/backend.git
     

2.   Navigate to the project directory:

         cd backend

3.   Install dependencies:

         npm install

4.   Install dependencies:

         npm run start

## API Endpoints

The backend provides the following API endpoints:

- **Create Wallet**: Create a new wallet for a user.
- **Transfer Funds**: Transfer funds between wallets.
- **Get Wallet Balance**: Retrieve the balance of a wallet.
- **Associate Wallet with User**: Associate a wallet with a user.
- **Stake Amount**: Add an amount to stake.
- **Stake Transaction**: Perform a stake transaction.
- **Transaction List**: Retrieve a list of transactions for a wallet.
- **Update Transaction Status**: Update the status of a transaction.
- **Purchase Coin with BTC**: Purchase coins using Bitcoin.
- **Purchase Coin with ETH**: Purchase coins using Ethereum.


Refer to the API documentation for detailed information on each endpoint.
   

## Usage

  To utilize the Wallet Service Backend:

1. Ensure the backend server is running.
2. Configure the mobile wallet app to communicate with the backend server using appropriate API endpoints and authentication tokens.
3. Utilize the provided API endpoints to perform wallet-related operations such as creating wallets, transferring funds, and staking. For example:
   - To create a new wallet for a user, use the **Create Wallet** API.
   - To transfer funds between wallets, use the **Transfer Funds** API.
   - To retrieve the balance of a wallet, use the **Get Wallet Balance** API.
   - To associate a wallet with a user, use the **Associate Wallet with User** API.
   - To add an amount to stake, use the **Stake Amount** API.
   - To perform a stake transaction, use the **Stake Transaction** API.
   - To retrieve a list of transactions for a wallet, use the **Transaction List** API.
   - To update the status of a transaction, use the **Update Transaction Status** API.
   - To purchase coins using Bitcoin, use the **Purchase Coin with BTC** API.
   - To purchase coins using Ethereum, use the **Purchase Coin with ETH** API.
4. Leverage Firebase for notifications and Socket.io for real-time transaction updates.


## High-Level Process

The Wallet Service Backend follows a structured process flow to facilitate the management of USB cryptocurrency assets within the mobile wallet application. The process can be summarized as follows:

1. **Wallet Creation and Association**: 
   - **Wallet Creation**: Users can create their USB wallets through the backend system.
   - **Wallet Association**: Each wallet is associated with a unique identifier and linked to the user's account. Optionally, users can link a username to their account, allowing others to transfer USB to their account using the username instead of the full address.

2. **Transaction Initiation and Authorization**: 
   - Users initiate transactions such as fund transfers, stake additions, and coin purchases through the mobile wallet interface. 
   - These requests are securely transmitted to the backend system for authorization.
   - Real-time updates and notifications are sent via Socket.io to users' mobile devices, providing instant alerts for transaction confirmations and other relevant events.

3. **Transaction Processing**: 
   - The backend system processes authorized transactions, verifying account balances, executing fund transfers, updating stake amounts, and recording transaction details.

4. **Blockchain Integration**: 
   - For transactions involving blockchain networks, the backend system interacts with the respective blockchain networks to broadcast transactions, monitor confirmations, and update transaction statuses.

5. **Transaction History and Reporting**: 
   - Users can access their transaction history and generate reports detailing their USB cryptocurrency transactions, providing transparency and accountability for their financial activities.

6. **Maintenance and Monitoring**: 
   - The backend system undergoes routine maintenance and monitoring to ensure optimal performance, reliability, and security of the platform, with updates and improvements implemented as necessary.

## Contact Us

If you have any questions, suggestions, or feedback, feel free to reach out to us. We're here to help!

- Email: [press@stabolut.com](mailto:press@stabolut.com)



