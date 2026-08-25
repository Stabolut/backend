# Stabolut Backend API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

A scalable Node.js & Express backend providing gasless relayed transactions, user wallet management, staking services, real-time WebSocket events, and push notifications for the **Stabolut Ecosystem** (USB Token on Arbitrum & XDC).

---

## 📋 Table of Contents
- [Architecture & Key Features](#-architecture--key-features)
- [Prerequisites](#-prerequisites)
- [Quick Start (Docker Compose)](#-quick-start-with-docker-compose-recommended)
- [Manual Setup (Local Node.js)](#-manual-setup-without-docker)
- [Environment Variables Guide](#-environment-variables-guide)
- [Interactive API Documentation (Swagger)](#-interactive-api-documentation)
- [Relaying Gasless Transactions](#-how-gasless-relaying-works)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Architecture & Key Features

- **Gasless Relayed Transfers**: Submits user-signed EIP-712 / ERC-865 meta-transactions to the blockchain on behalf of mobile users with zero gas cost to the end user.
- **Multi-Chain Support**: Arbitrum Sepolia (`421614`), Arbitrum One (`42161`), and XDC Apothem (`51`).
- **Live WebSocket Feed**: Real-time push of transaction states to mobile and web clients via Socket.IO.
- **Staking Services**: Automated staking reward distribution and yield tracking.
- **Interactive Documentation**: Embedded Swagger UI at `/api-docs`.

---

## 💻 Prerequisites

- **Node.js**: `v18.x` or later ([Download](https://nodejs.org/))
- **MongoDB**: A running MongoDB instance locally (`mongodb://localhost:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.
- **Docker & Docker Compose** *(Optional, recommended for 1-command startup)*

---

## ⚡ Quick Start with Docker Compose (Recommended)

The fastest way to get the backend and database running locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Stabolut/backend.git
   cd backend
   ```

2. **Create your environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start the containers:**
   ```bash
   docker compose up --build
   ```

The backend will automatically connect to the containerized MongoDB instance and start on **`http://localhost:8003`**.

---

## 🛠️ Manual Setup (Without Docker)

### 1. Install Dependencies
```bash
git clone https://github.com/Stabolut/backend.git
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your preferred configuration (see table below).

### 3. Start the Server

```bash
# Start in production mode
npm start

# Or start in development mode
npm run dev
```

---

## 🔑 Environment Variables Guide

| Variable | Required | Description | Example / Default |
| :--- | :---: | :--- | :--- |
| `PORT` | No | Port the HTTP/WebSocket server listens on | `8003` |
| `NODE_ENV` | No | Runtime environment (`development`, `production`) | `development` |
| `MONGO_URL` | **Yes** | MongoDB connection string | `mongodb://localhost:27017/usb_wallet_db` |
| `ARB_RPC_URI` | **Yes** | Arbitrum JSON-RPC endpoint | `https://sepolia-rollup.arbitrum.io/rpc` |
| `ARB_CONTRACT_ADDRESS` | **Yes** | USB Token contract address on Arbitrum | `0x24c8479b8af9742c5160e0c29197e87a584cfe99` |
| `ARB_FUNDING_ADDRESS` | **Yes** | Relayer wallet address that pays gas | `0x...` |
| `ARB_FUNDING_KEY` | **Yes** | Private key of the relayer wallet | `your_private_key_here` |
| `JWT_SECRET_KEY` | **Yes** | Secret string used for signing auth tokens | `any_secure_random_string` |
| `SECRET_KEY` | **Yes** | Internal application encryption key | `any_secure_64_char_hex` |
| `XDC_RPC_URI` | No | XDC / Apothem JSON-RPC endpoint | `https://rpc.apothem.network` |
| `EMAIL_HOST` | No | SMTP host for email delivery (SendGrid, Postmark) | `smtp.sendgrid.net` |
| `EMAIL_PASS` | No | SMTP API key / password | `your_smtp_password` |

---

## 📖 Interactive API Documentation

Once the server is running, open your browser and navigate to:

👉 **[http://localhost:8003/api-docs](http://localhost:8003/api-docs)**

This opens the interactive Swagger UI where you can inspect schemas and test all endpoints directly.

---

## 🔄 How Gasless Relaying Works

1. The **Mobile App** prompts the user to sign a transfer message offline with their private key (no gas required).
2. The signed payload is sent via `POST /api/v1/stabolut/wallet/transfer-token`.
3. The **Backend Relayer** validates the signature, wraps it into a contract call (`transferPreSigned`), and submits the transaction to Arbitrum using its funded `ARB_FUNDING_KEY` wallet.
4. The contract transfers the tokens and deducts a small fee in USB tokens from the sender to reimburse the relayer.

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our workflow and code standards.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
