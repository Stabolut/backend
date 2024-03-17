const routeResponseWithData = (res, status, message, data, statusCode) => {
  res.status(statusCode).json({
    Success: status,
    message: message,
    data: data,
  });
};

/**
 *
 * @param res
 * @param status
 * @param message
 */
const routeResponseOnlyMessage = (res, status, message) => {
  res.status(200).json({
    Success: status,
    message: message,
  });
};
const errorResponse = (res, message, statusCode, data = null) => {
  const responseObject = {
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

const errorResponseWithData = (res, message, statusCode, data) => {
  res.status(statusCode).json({
    errors: [
      {
        message: message,
      },
    ],
    data: data,
  });
};

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
  routeResponseWithData,
  routeResponseOnlyMessage,
  errorResponse,
  errorResponseWithData,
  sendErrorResponse,
  sendSuccessResponse,
};
