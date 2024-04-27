// we dont have to expose lot of info to frontend incase of service errors
// these mostly are of type 5**
const { StatusCodes } = require('http-status-codes');

class ServiceError extends Error {
    constructor(
        message,
        explanation,
        statusCode=StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super();
        this.name = "ServiceError";
        this.message = message;
        this.explanation = explanation;
        this.statusCode = statusCode;
    }
}