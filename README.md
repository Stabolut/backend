# Backend API for USB Token Management

## Overview

The Backend API for USB Token Management serves as the central component for handling transactions and managing user data for both the admin panel and mobile app. Built using Node.js with the Express framework and MongoDB for the database, this API provides endpoints for various functionalities such as user authentication, transaction processing, and live updates using Firebase for notifications and Socket.io.

## Technology Stack

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

The API provides endpoints for various functionalities, including:

  - User authentication
- Transaction processing
- Live updates
- User management
- Wallet management

Refer to the API documentation for detailed information on each endpoint.
   

## Usage

  1. **Authentication:** Use the provided endpoints for user authentication to ensure secure access to the API.
  2. **Transaction Processing:** Utilize the transaction endpoints to process deposits, staking, and transfers of USB tokens.
  3. **Live Updates:** Enable live updates using Socket.io to provide real-time notifications to users.
  4. **User Management:** Manage user accounts.
  5. **Wallet Management:** Handle wallet-related operations such as creation, import,transactions histroy and balance retrieval.

