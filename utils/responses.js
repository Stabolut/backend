const sendErrorResponse = (res, message, statusCode, data = null) => {
  const responseObject = {
    Success: false,
    errors: [
      {
        message: message,
      },
    ],
  };

  if (data !== null) {
    responseObject.data = data;
  }

  res.status(statusCode).json(responseObject);
};

const sendSuccessResponse = (res, message, statusCode, data = null) => {
  const responseObject = {
    Success: true,
    message: message,
  };

  if (data !== null) {
    responseObject.data = data;
  }

  res.status(statusCode).json(responseObject);
};

module.exports = {
  sendErrorResponse,
  sendSuccessResponse,
};
