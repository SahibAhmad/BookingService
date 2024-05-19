const axios = require('axios').default;
const { BookingRepository } = require('../repository/index.js');
const { FLIGHT_SERVICE_PATH , AUTH_SERVICE_PATH ,REMINDER_BINDING_KEY } = require('../config/serverConfig.js')
const { ServiceError } = require('../utils/errors/index.js');
const {createChannel, publishMessage} = require('../utils/messageQueue.js');

const bookingRepository = new BookingRepository();

class BookingService {
    async sendToQueue(emailData,serviceToken) 
    {
         const channel = await createChannel();
         const data = {
         message : emailData,
         service : serviceToken,
    };
 
  
      await publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));let message 
    }

    //flightId, 
    async createBooking(data) {
        try {
            const flightId = data.flightId;
            

            let getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            

            const response = await axios.get(getFlightRequestUrl);
            const flightData = response.data.data;
            
            

            let priceOfTheFlight = flightData.price;

            if (data.noOfSeats > flightData.totalSeats) {

                throw new ServiceError("Something Went Wrong in Booking Process", "Insufficiant seats available!");
            }


            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = { ...data, totalCost };

            const booking = await bookingRepository.create(bookingPayload);

            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;


            await axios.patch(updateFlightRequestUrl, { totalSeats: flightData.totalSeats - booking.noOfSeats });

            const finalBooking = await bookingRepository.update(booking.id, { status: "booked" });




            const userDetailsFetchUrl = `${AUTH_SERVICE_PATH}/api/v1/user`;

            
           
            const userDetails = await axios({
                method: 'get',
                url: userDetailsFetchUrl,
                data: {
                    id: bookingPayload.userId
                }
            });

            const email = userDetails.data.data.email;
           
            const emailDataImmediate = {
                subject: "booking succesfull",
                content: "Your booking has been successfull",
                recepientEmail: "sahibprojects998@gmail.com", //actually here should be email fetched above

            }
            await this.sendToQueue(emailDataImmediate,"SEND_BASIC_EMAIL");

            const emailDataBeforeDeparture = {
                subject : "Boarding Reminder",
                content: "This is demo reminder for your flight",
                recepientEmail: "sahibprojects998@gmail.com", //again here we should use email (but they were just dummy invalid emails)
                notificationTime : "2024-05-18 19:00:07",
            }

            await this.sendToQueue(emailDataBeforeDeparture, "CREATE_TICKET")




            return finalBooking;

        } catch (error) {
            if (error.name == 'RepositoryError' || 'ValidationError') {
                throw error;
            }




            throw new ServiceError();
        }
    }

    async update(bookingId, newData) {
        // There are multiple things which i can think of here updation
        // maybe we want to update number of seats(idk if this is done in real)
        // or maybe we want to cancel the flight
        // in cancelling we have to again update the flight as well

        try {

            const flightId = newData.flightId;

            let getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

            const response = await axios.get(getFlightRequestUrl);
            const flightData = response.data.data;

            const totalCost = 0;
            const newDataPayLoad = { ...newData, totalCost };
            newDataPayLoad.status = "InProcess"
            const booking = await bookingRepository.update(bookingId, newDataPayLoad);

            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

            await axios.patch(updateFlightRequestUrl, { totalSeats: flightData.totalSeats + booking.noOfSeats });

            const finalBooking = await bookingRepository.update(booking.id, { status: "Cancelled" });


            return finalBooking;



        } catch (error) {

            if (error.name == 'RepositoryError' || 'ValidationError') {
                throw error;
            }




            throw new ServiceError();
        }
    }
}

module.exports = BookingService