const { sendErrorResponse } = require("../utils/responses");

const httpErrorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log("Api error", err)
    const { status, message, data } = err;
    return sendErrorResponse(
      res,
      message.replaceAll(/Validation error: /g, ""),
      status || 500,
      data || null
    );
  });
};

module.exports = httpErrorHandler;
