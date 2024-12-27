const dotenv = require("dotenv");
const environment = process.env.NODE_ENV || "production";
if (environment !== "k8s") dotenv.config({ path: `${environment}.env` });
const isDevEnv = environment === "development";
const RPC_URI = process.env.RPC_URI;
const SOCKET_URI = process.env.SOCKET_URI;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const FEE = process.env.FEE;
const FUNDING_ADDRESS = process.env.FUNDING_ADDRESS;
const FUNDING_KEY = process.env.FUNDING_KEY;
const MONGO_URL = process.env.MONGO_URL;
const SESSION_EXPIRES_IN = "1d";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const BITCOIN_TOKEN = process.env.BITCOIN_TOKEN;
const SECRET_KEY = process.env.SECRET_KEY;
const BITCOIN_NODE_URI = process.env.BITCOIN_NODE_URI;
const ADMIN_BTC_ADDRESS = process.env.ADMIN_BTC_ADDRESS;
const BITPAY_URL = process.env.BITPAY_URL;
const BTC_TO_USD_URL = process.env.BTC_TO_USD_URL;
const ETH_TO_USD_URL = process.env.ETH_TO_USD_URL;
const BLOCKCHAIN_CHAIN_ID = process.env.BLOCKCHAIN_CHAIN_ID;
const PORT = process.env.EMAIL_PORT;
const USER = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;
const HOST = process.env.EMAIL_HOST;
const SUBJECT = "Support Email";
const EMAL_SENDER = "cto@stabolut.com";
const RECEIPENT = "cto@stabolut.com";
const ETH_RPC_URL = process.env.ETH_RPC_URL;
const TOKEN_DECIMAL=1e2


const emailForAdminContact = (name, email, message, phone) => {
  let mobile = "";
  if (phone) {
    mobile = `Phone: ${phone} <br>`;
  }
  return `
               Name: ${name} <br>
               Email: ${email} <br>
               ${mobile}
                Message: ${message} <br><br>
               
                Regards, <br> <br>

                Auto Generated Email`;
};

const ABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      { indexed: false, internalType: "uint256", name: "fee", type: "uint256" },
    ],
    name: "ApprovalPreSigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      { indexed: false, internalType: "uint256", name: "fee", type: "uint256" },
    ],
    name: "TransferPreSigned",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "bytes", name: "_signature", type: "bytes" },
      { internalType: "address", name: "_spender", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "approvePreSigned",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_who", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
    ],
    name: "burn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "bytes", name: "_signature", type: "bytes" },
      { internalType: "address", name: "_spender", type: "address" },
      { internalType: "uint256", name: "_subtractedValue", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "decreaseAllowancePreSigned",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_spender", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "getApprovePreSignedHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_spender", type: "address" },
      { internalType: "uint256", name: "_subtractedValue", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "getDecreaseAllowancePreSignedHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_spender", type: "address" },
      { internalType: "uint256", name: "_addedValue", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "getIncreaseAllowancePreSignedHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_from", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "getTransferFromPreSignedHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "getTransferPreSignedHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "bytes", name: "_signature", type: "bytes" },
      { internalType: "address", name: "_spender", type: "address" },
      { internalType: "uint256", name: "_addedValue", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "increaseAllowancePreSigned",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "bytes", name: "_signature", type: "bytes" },
      { internalType: "address", name: "_from", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "transferFromPreSigned",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "bytes", name: "_signature", type: "bytes" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "transferPreSigned",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

module.exports = {
  RPC_URI,
  CONTRACT_ADDRESS,
  ABI,
  FEE,
  FUNDING_ADDRESS,
  FUNDING_KEY,
  SOCKET_URI,
  MONGO_URL,
  PORT,
  USER,
  HOST,
  PASS,
  SUBJECT,
  emailForAdminContact,
  EMAL_SENDER,
  RECEIPENT,
  BITCOIN_TOKEN,
  SECRET_KEY,
  BITCOIN_NODE_URI,
  SESSION_EXPIRES_IN,
  JWT_SECRET_KEY,
  ADMIN_BTC_ADDRESS,
  BITPAY_URL,
  BTC_TO_USD_URL,
  BLOCKCHAIN_CHAIN_ID,
  ETH_TO_USD_URL,
  ETH_RPC_URL,
  TOKEN_DECIMAL
};
