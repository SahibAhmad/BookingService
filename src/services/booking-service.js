const axios = require('axios').default;
const { BookingRepository } = require('../repository/index.js');
const {FLIGHT_SERVICE_PATH } = require('../config/serverConfig.js')
const {ServiceError} = require('../utils/errors/index.js');

const bookingRepository = new BookingRepository();

class BookingService {

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            
            let getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
    
            const response =  await axios.get(getFlightRequestUrl).then();
            const flightData = response.data.data;

            let priceOfTheFlight = flightData.price;

            if(data.noOfSeats > flightData.totalSeats) {
                
                throw new ServiceError("Something Went Wrong in Booking Process","Insufficiant seats available!");
            }
            

            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};

            const booking = await bookingRepository.create(bookingPayload);

            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

            await axios.patch(updateFlightRequestUrl,{totalSeats: flightData.totalSeats - booking.noOfSeats });

            const finalBooking = await bookingRepository.update(booking.id,{status: "booked"});


            return finalBooking;
           
        } catch (error) {
              if(error.name == 'RepositoryError' || 'ValidationError') {
                throw error;
            }



            
            throw new ServiceError();
        }
    }
}

module.exports = BookingService