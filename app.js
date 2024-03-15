const path = require("path");
if (process.env.NODE_ENV !== "production")
  require("dotenv").config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV || ".env"),
  });
const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
var mongoose = require("mongoose");
const runScript = require("./web3");
const { stakingService } = require("./services/stake");
const { stakingRewardService } = require("./services/sendReward");

// Connect to Ethereum blockchain using Web3
const { MONGO_URL } = require("./config");
// Contract address to listen to
const { newWeb3Connection } = require("./connection");
const transferBtcScript = require("./services/btc");
const { RPC_URI } = require("./config");
const app = express();
const router = require("./routes/index");
const socketIO = require("./socket");
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);

app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = MONGO_URL;
const connectToMongo = async () => {
  try {
    mongoose.connect(MONGO_URI);
    // setInterval(function() {
    //   transferBtcScript()
    // }, 5000);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.log("Retrying connection to MongoDB...");
    setTimeout(connectToMongo, 5000);
  }
};

// Call function to connect to MongoDB
connectToMongo();

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

newWeb3Connection(RPC_URI)
  .then(() => {
    console.log("Connected to WEB3 Blockchain!");
  })
  .catch((e) => {
    console.log(`Error connection to WEB3  blockchain: ${e.message}`);
  });

app.use("/v1/eurb", router);

const PORT = process.env.PORT;

const httpServer = http.createServer(app);
socketIO(httpServer);

runScript();
stakingService();
stakingRewardService();

httpServer.listen(PORT || 8003, () => {
  console.log(`Wallet service is listening on port ${PORT}`);
});
