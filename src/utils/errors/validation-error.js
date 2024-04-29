const {StatusCodes} = require('http-status-codes');

class ValidationError extends Error {
    constructor(error) {
        let explanation = []; // we can build this as we know how sequelize gives validation error
        error.errors.forEach((err) => {
            explanation.push(err.message);
        })
        super();

        this.name = "ValidationError";
        this.message = "Not able to validate the data sent in the request";
        this.explanation = "Couldnt validate data";
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = ValidationError