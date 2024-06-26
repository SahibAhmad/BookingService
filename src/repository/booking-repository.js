const { StatusCodes } = require("http-status-codes");
const { ValidationError, AppError } = require('../utils/errors/index');
const { Booking } = require('../models/index');



class BookingRepository {
    async create(data) {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            
            if (error.name == "SequelizeValidationError") {
                throw new ValidationError(error);
            }

            throw new AppError(
                "RepositoryError",
                "Cant Create Booking",
                "There was some issue with booking. Please Try Later",
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(bookingId, newData) {
        try {

            const booking = await Booking.findByPk(bookingId);
            booking.status = newData.status;
            booking.noOfSeats = 0;
            booking.totalCost = 0;
            await booking.save();
            return booking;

        } catch (error) {
            throw new AppError(
                "RepositoryError",
                "Cant update booking",
                "There was some issue while try to update booking status",
                StatusCodes.INTERNAL_SERVER_ERROR,
            )
        }
    }
}

module.exports = BookingRepository