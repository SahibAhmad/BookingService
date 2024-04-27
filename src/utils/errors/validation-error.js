class ValidationError extends Error {
    constructor(error) {
        let explanation = []; // we can build this as we know how sequelize gives validation error
        errors.errors.forEach((err) => {
            explanation.push(err.message);
        })

        this.name = "ValidationError";
        this.message = "Not able to validate the data sent in the request";
        this.explanation = explantion;
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = ValidationError