

const routeResponseWithData = (res, status, message, data, statusCode) => {

    res.status(statusCode).json({
        Success: status,
        message: message,
        data: data,
    })
}

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
    })
}
const errorResponse = (res, message, statusCode) => {
    res.status(statusCode).json({
        Success: false,
        "errors": [{
            message: message
        }]

    })
}
const errorResponseWithData = (res, message, statusCode, data) => {
    res.status(statusCode).json({
        "errors": [{
            message: message
        }],
        data: data

    })
}

module.exports = {
    routeResponseWithData,
    routeResponseOnlyMessage,
    errorResponse,
    errorResponseWithData
}
