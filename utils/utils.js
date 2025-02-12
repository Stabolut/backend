const config = require("../config");
const jwt = require("jsonwebtoken");
const { NETWORKS } = require("../config")

const isValidJWT = function (token) {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY, {
      json: true,
    });
    return decoded;
  } catch (e) {
    return false;
  }
};
getWebInstance = (network) => {
  if (network === NETWORKS.Arbitrium.name) {
    return global.web3
  }
  else {
    return global.web3xdc
  }

  // let web = network === NETWORKS.Arbitrium.name ? global.web3 : global.web3xdc
  return web
}

module.exports = {
  isValidJWT: isValidJWT,
  getWebInstance: getWebInstance
};
