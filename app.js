const path = require("path");

// Load environment variables from .env file if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV || ".env"),
  });
}
const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
var mongoose = require("mongoose");
const connectToMongo = require("./connection/db");
const newWeb3Connection = require("./connection/blockchain");
const {
  ethToUsbTokenExchangeService,
} = require("./workers/ethToUsbTokenExchangeService");
const {
  btcToUsbTokenExchangeService,
} = require("./workers/btcToUsbTokenExchangeService");

const {
  sendReferralTokenService,
} = require("./workers/sendReferralTokenService");

const { MONGO_URL, RPC_URI } = require("./config");
const router = require("./routes/index");
const socketIO = require("./workers/socketService");
const { constant } = require("./constants/constant");
const { swaggerUi, swaggerDocs } = require("./docs/swagger");
const { stakingRewardCalculations } = require("./workers/StakeReward/stakingRewardCalculations")
const { APRRateService } = require("./workers/StakeReward/APRRateService");
const { USDTConversionService } = require("./workers/USDTConversionService");
//Workers
const { XDCTransactionListener } = require("./workers/TransactionListener/XDCTransactionListener");
const { arbitriumTransactionListener } = require("./workers/TransactionListener/arbitriumTransactionListener");
const { AirdropService } = require("./workers/airdropSerivce")

const app = express();
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
const MONGO_URI = MONGO_URL;

// Trust proxy for correct IP logging in Heroku or Cloudwatch
app.enable("trust proxy");

// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Logging HTTP requests
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

// Enable CORS
app.use(cors());

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Parse request bodies as JSON
app.use(bodyParser.json());

// Call function to connect to MongoDB
connectToMongo();

// Connect to Web3 blockchain
newWeb3Connection();
app.get(constant.api.prefix, (req, res) => {
  res.send("Node version 13 is running wit new update on react-native side");
});

// Define API routes
app.use(constant.api.prefix, router);

const PORT = process.env.PORT;

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize socket.io
socketIO(httpServer);

// Run scripts for various services
arbitriumTransactionListener();
// XDCTransactionListener();
sendReferralTokenService();
stakingRewardCalculations()
APRRateService();
// USDTConversionService();
// ethToUsbTokenExchangeService();
// btcToUsbTokenExchangeService();
AirdropService()


// Start listening on the specified port
httpServer.listen(PORT || 8003, () => {
  console.log(`Wallet service is listening on port ${PORT}`);
});
